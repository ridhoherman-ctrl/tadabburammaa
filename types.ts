export interface DailyContent {
  day: number;
  surahName: string;
  surahRef: number; // Nomor urut surah (78-114)
  ayahRef: number; // Nomor ayat
  ayahNumber: string; // Tampilan string (misal "1-2")
  arabicText: string;
  translation: string;
  hikmah: string;
  praktik: string[];
  hadithText: string;
  hadithSource: string;
  reflectionQuestions: string[];
}

export interface DailyTrack {
  tadabburRead: boolean;
  practiceDone: boolean;
  duaDone: boolean;
  notes: string;
}

export interface UserProgress {
  tracker: Record<number, DailyTrack>;
  cachedContent: Record<number, DailyContent>;
}

export enum AppView {
  LANDING = 'LANDING',
  GRID = 'GRID',
  DETAIL = 'DETAIL',
  JOURNAL = 'JOURNAL',
}