export interface DailyContent {
  day: number;
  surahName: string;
  ayahNumber: string;
  arabicText: string;
  translation: string;
  hikmah: string;
  praktik: string[]; // Changed to array for steps
  hadithText: string;
  hadithSource: string;
  reflectionQuestions: string[]; // New section
}

export interface DailyTrack {
  tadabburRead: boolean;
  practiceDone: boolean;
  duaDone: boolean;
  notes: string;
}

export interface UserProgress {
  tracker: Record<number, DailyTrack>; // Granular tracking per day
  cachedContent: Record<number, DailyContent>;
}

export enum AppView {
  GRID = 'GRID',
  DETAIL = 'DETAIL',
  JOURNAL = 'JOURNAL',
}