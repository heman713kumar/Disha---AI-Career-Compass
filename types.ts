export enum UserRole {
  STUDENT = 'Student',
  PROFESSIONAL = 'Working Professional',
  PARENT = 'Parent'
}

export enum SupportedLanguage {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  groundingChunks?: GroundingChunk[];
}

export interface PathwayMilestone {
  title: string;
  description: string;
  timeline: string;
  type: 'major' | 'minor';
}

export interface PathwayPhase {
  phaseName: string;
  milestones: PathwayMilestone[];
}

export interface PathwayData {
  title: string;
  phases: PathwayPhase[];
}
