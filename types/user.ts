export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  title: string;
  level: number;
  gamesPlayed: number;
  victories: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
}

export interface SystemSettings {
  soundEnabled: boolean;
  soundVolume: number;
  tacticalGrid: boolean;
  scanlineEffect: boolean;
  aiThinkingBudget: 'standard' | 'high';
  autoSave: boolean;
}
