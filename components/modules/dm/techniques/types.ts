
export interface WaveformPoint {
  time: number;
  bit: number;
  carrier: number;
  modulated: number;
}

export interface ConstellationPoint {
  i: number;
  q: number;
  label: string;
}

export interface TechniqueInfo {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  equation: string;
}
