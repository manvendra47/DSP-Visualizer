
export enum DomainId {
  HOME = 'home',
  PCM = 'pcm',
  DIGITAL_MODULATION = 'digital_modulation',
  TRANSFORMS = 'transforms'
}

export enum ModuleId {
  // PCM Modules
  INTRODUCTION = 'intro',
  SAMPLING_QUANTIZATION = 'sampling_quantization',
  PCM_DPCM = 'pcm_dpcm',
  LINE_CODES = 'line_codes',
  DELTA_MODULATION = 'delta_modulation',
  ADAPTIVE_DM = 'adaptive_dm',
  QUIZ = 'quiz',

  // Transforms Module
  TRANSFORMS = 'transforms',

  // Digital Modulation Modules
  DM_INTRO = 'dm_intro',
  DM_CAPACITY = 'dm_capacity', // Information Capacity, Bit Rate, Baud
  DM_TECHNIQUES = 'dm_techniques', // ASK, FSK, PSK, QAM
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LineCodeData {
  time: number;
  value: number;
}

export enum LineCodeType {
  UNIPOLAR_NRZ = 'Unipolar NRZ',
  POLAR_NRZ = 'Polar NRZ',
  UNIPOLAR_RZ = 'Unipolar RZ',
  BIPOLAR_RZ = 'Bipolar RZ',
  MANCHESTER = 'Manchester',
}

export enum ModulationType {
  ASK = 'ASK',
  FSK = 'FSK',
  PSK = 'PSK',
  QAM = 'QAM'
}
