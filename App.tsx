import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { TadabburCard } from './components/TadabburCard';
import { JournalView } from './components/JournalView';
import { DailyContent, UserProgress, AppView, DailyTrack } from './types';
import { fetchDailyTadabbur } from './services/geminiService';

const TOTAL_DAYS = 99;
const STORAGE_KEY = 'tadabbur_juz_amma_v2';

const defaultTrack: DailyTrack = {
  tadabburRead: false,
  practiceDone: false,
  duaDone: false,
  notes: ''
};

const App: React.FC = () => {
  // State
  const [view, setView] = useState<AppView>(AppView.GRID);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Data & Progress
  const [progress, setProgress] = useState<UserProgress>({
    tracker: {},
    cachedContent: {}
  });

  // Handle Online/Offline Status
  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (e) {
        console.error("Failed to parse saved progress", e);
      }
    }
  }, []);

  // Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Handle Day Selection
  const handleSelectDay = async (day: number) => {
    setCurrentDay(day);
    setView(AppView.DETAIL);
    setError(null);

    // Check cache first
    if (progress.cachedContent[day]) {
      return;
    }

    // Fetch from API if not in cache
    setIsLoading(true);
    try {
      const content = await fetchDailyTadabbur(day);
      setProgress(prev => ({
        ...prev,
        cachedContent: {
          ...prev.cachedContent,
          [day]: content
        }
      }));
    } catch (err) {
      setError("Gagal memuat konten. Pastikan koneksi internet lancar.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Completing a Day and moving to the next
  const handleCompleteDay = () => {
    if (currentDay === null) return;
    
    // Automatically move to next day if not the last day
    const nextDay = currentDay + 1;
    if (nextDay <= TOTAL_DAYS) {
      handleSelectDay(nextDay);
    } else {
      // Finished all days
      setView(AppView.GRID);
      setCurrentDay(null);
    }
  };

  // Handle Tracker Updates
  const handleUpdateTrack = (updates: Partial<DailyTrack>) => {
    if (currentDay === null) return;

    setProgress(prev => {
      const currentTrack = prev.tracker[currentDay] || { ...defaultTrack };
      return {
        ...prev,
        tracker: {
          ...prev.tracker,
          [currentDay]: {
            ...currentTrack,
            ...updates
          }
        }
      };
    });
  };

  const handleHomeClick = () => {
    setView(AppView.GRID);
    setCurrentDay(null);
  };

  const handleJournalClick = () => {
    setView(AppView.JOURNAL);
    setCurrentDay(null);
  };

  // Helper to calculate completion stats
  const getCompletedDaysList = () => {
    return Object.keys(progress.tracker)
      .map(Number)
      .filter(day => progress.tracker[day]?.tadabburRead);
  };

  // Export Data Logic
  const handleExportData = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tadabbur-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Data Logic
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        
        // Simple validation
        if (parsed && typeof parsed === 'object' && 'tracker' in parsed) {
          if (window.confirm("Apakah Anda yakin ingin menimpa data saat ini dengan file backup?")) {
            setProgress(parsed);
            alert("Data berhasil dipulihkan!");
          }
        } else {
          alert("File tidak valid atau rusak.");
        }
      } catch (err) {
        alert("Gagal membaca file. Pastikan file berformat .json yang benar.");
      }
    };
    reader.readAsText(file);
  };

  // Render Helpers
  const renderContent = () => {
    let key = '';
    let contentElement = null;

    if (view === AppView.JOURNAL) {
      key = 'journal';
      contentElement = (
        <JournalView 
          tracker={progress.tracker}
          cachedContent={progress.cachedContent}
          onNavigateToDay={handleSelectDay}
          onBack={handleHomeClick}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      );
    } else if (view === AppView.GRID) {
      key = 'grid';
      contentElement = (
        <DaySelector 
          totalDays={TOTAL_DAYS}
          completedDays={getCompletedDaysList()}
          onSelectDay={handleSelectDay}
        />
      );
    } else if (currentDay !== null) {
      const content = progress.cachedContent[currentDay];
      const track = progress.tracker[currentDay] || defaultTrack;

      if (error) {
        key = 'error';
        contentElement = (
          <div className="flex flex-col items-center justify-center p-10 text-center min-h-[50vh]">
            <div className="text-amber-500 mb-4 text-4xl">⚠️</div>
            <p className="text-stone-600 mb-6 font-serif-text">{error}</p>
            <button 
              onClick={() => handleSelectDay(currentDay)}
              className="px-6 py-2 bg-teal-700 text-white rounded-full shadow hover:bg-teal-800 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        );
      } else if (isLoading || content) {
        // Use a composite key to trigger transitions between loading and content, or between days
        key = content ? `day-${content.day}` : 'loading';
        contentElement = (
          <TadabburCard
            content={content || { day: currentDay } as DailyContent} 
            track={track}
            onUpdateTrack={handleUpdateTrack}
            onCompleteDay={handleCompleteDay}
            isLoading={isLoading}
            isOnline={isOnline}
          />
        );
      }
    }
    
    if (!contentElement) return null;

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {contentElement}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
      <Header 
        completedCount={getCompletedDaysList().length} 
        totalDays={TOTAL_DAYS}
        onHomeClick={handleHomeClick}
        onJournalClick={handleJournalClick}
        isOnline={isOnline}
        isLoading={isLoading}
      />
      
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
           {renderContent()}
        </AnimatePresence>
      </main>

      <footer className="bg-teal-900 text-teal-300/60 py-8 text-center text-sm mt-8 border-t border-teal-800">
        <p className="font-serif-text italic">© 2024 Tadabbur Juz Amma App</p>
      </footer>
    </div>
  );
};

export default App;