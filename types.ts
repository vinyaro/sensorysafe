export enum NoiseLevelStatus {
  Safe = 'Safe',
  Caution = 'Caution',
  Danger = 'Danger'
}

export interface AudioState {
  isListening: boolean;
  decibels: number;
  status: NoiseLevelStatus;
  frequencyData: Uint8Array;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Language = 'en' | 'pt';
