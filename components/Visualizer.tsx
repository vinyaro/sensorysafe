import React, { useEffect, useRef } from 'react';
import { NoiseLevelStatus } from '../types';

interface VisualizerProps {
  frequencyData: Uint8Array;
  status: NoiseLevelStatus;
}

const Visualizer: React.FC<VisualizerProps> = ({ frequencyData, status }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getColor = (status: NoiseLevelStatus) => {
    switch (status) {
      case NoiseLevelStatus.Safe: return 'rgb(45, 212, 191)'; // Teal 400
      case NoiseLevelStatus.Caution: return 'rgb(250, 204, 21)'; // Yellow 400
      case NoiseLevelStatus.Danger: return 'rgb(244, 63, 94)'; // Rose 500
      default: return 'rgb(148, 163, 184)';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    // Draw smooth curve
    ctx.lineWidth = 3;
    ctx.strokeStyle = getColor(status);
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = getColor(status);

    ctx.beginPath();

    const sliceWidth = width * 1.0 / frequencyData.length;
    let x = 0;

    // Draw mirrored wave for symmetry
    // We'll just draw one nice line based on data
    
    // Move to start
    ctx.moveTo(0, height / 2);

    for (let i = 0; i < frequencyData.length; i++) {
      const v = frequencyData[i] / 128.0; // normalize 0-255 to roughly 0-2
      const y = (v * height) / 3; // scale height

      // Flip y to center it
      const centeredY = (height / 2) + (i % 2 === 0 ? y / 2 : -y / 2); // Oscillate around center
      
      // To make it look more like a wave, use sine approximation or just simple plotting
      // Let's do a simple plot centered
      const normalizedY = (frequencyData[i] / 255) * (height / 2);
      
      if (i === 0) {
        ctx.moveTo(x, height / 2);
      } else {
        // Simple linear connection looks jagged. Let's just draw bars or a filled path?
        // Let's try a quadratic curve for smoothness.
        const prevX = x - sliceWidth;
        // const prevY = ... complicated to store previous.
        // Let's stick to lineTo for performance, but maybe average adjacent points.
      }

      // Let's actually do a mirrored bar graph which looks very modern
    }
    ctx.stroke();

    // Re-implmenting as mirrored bars centered vertically
    // This is often more visually pleasing for "noise" than a line graph
    ctx.clearRect(0, 0, width, height);
    
    const barWidth = (width / frequencyData.length) * 2.5;
    let barX = 0;

    for(let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] / 255) * height;
      
      ctx.fillStyle = getColor(status);
      
      // Center vertically
      const y = (height - barHeight) / 2;
      
      // Add some rounded corners logic if we were using path, but fillRect is faster
      // Lower opacity for higher frequencies to create fade effect
      ctx.globalAlpha = 1 - (i / frequencyData.length);
      
      ctx.fillRect(barX, y, barWidth, barHeight);

      barX += barWidth + 1;
    }
    
  }, [frequencyData, status]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={200} 
      className="w-full h-48 rounded-xl bg-slate-800/50 backdrop-blur-sm shadow-inner"
    />
  );
};

export default Visualizer;