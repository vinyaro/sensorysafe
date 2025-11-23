import { useState, useEffect, useRef, useCallback } from 'react';
import { NoiseLevelStatus, AudioState } from '../types';

// Calibrating standard web audio RMS to rough dB SPL
// This is an approximation as real SPL requires calibrated hardware.
const SMOOTHING_TIME_CONSTANT = 0.8;
const FFT_SIZE = 256;

export const useAudioAnalyzer = () => {
  const [state, setState] = useState<AudioState>({
    isListening: false,
    decibels: 0,
    status: NoiseLevelStatus.Safe,
    frequencyData: new Uint8Array(FFT_SIZE / 2),
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const calculateStatus = (db: number): NoiseLevelStatus => {
    if (db < 60) return NoiseLevelStatus.Safe;
    if (db < 100) return NoiseLevelStatus.Caution;
    return NoiseLevelStatus.Danger;
  };

  const update = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) for volume/dB
    let sum = 0;
    // Skip the first few bins (very low freq rumble) to avoid noise
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    
    // Convert RMS to dB
    // value is 0-255. 
    // 20 * log10(rms) ranges roughly from 0 to ~48 (log10(255) approx 2.4, 20*2.4=48)
    const value = rms > 0 ? 20 * Math.log10(rms) : 0;
    
    // Apply scaling and offset
    // We want a range that starts at 30dB (silence) and can reach >100dB (loud)
    // Max raw value ~48. 
    // 48 * 1.5 + 30 = 102dB (Max)
    // 0 * 1.5 + 30 = 30dB (Min)
    let displayDb = Math.max(30, Math.round((value * 1.5) + 30)); 
    
    setState(prev => ({
      ...prev,
      decibels: displayDb,
      status: calculateStatus(displayDb),
      frequencyData: dataArray,
    }));

    rafRef.current = requestAnimationFrame(update);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setState(prev => ({ ...prev, isListening: true }));
      update();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setState(prev => ({
      ...prev,
      isListening: false,
      decibels: 0,
      frequencyData: new Uint8Array(FFT_SIZE / 2).fill(0),
      status: NoiseLevelStatus.Safe
    }));
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening
  };
};