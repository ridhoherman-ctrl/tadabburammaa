import React, { useState, useEffect, useRef } from 'react';
import { DailyContent, DailyTrack } from '../types';

interface TadabburCardProps {
  content: DailyContent;
  track: DailyTrack;
  onUpdateTrack: (updates: Partial<DailyTrack>) => void;
  onCompleteDay: () => void;
  isLoading?: boolean;
  isOnline?: boolean;
}

const OrnamentalDivider = () => (
  <div className="flex items-center justify-center py-6 opacity-40">
    <div className="h-px bg-teal-800 w-16 md:w-32"></div>
    <div className="mx-4 text-teal-800 text-xl">✤</div>
    <div className="h-px bg-teal-800 w-16 md:w-32"></div>
  </div>
);

// Font Size Controller Component
const FontController: React.FC<{ size: number; setSize: (s: number) => void }> = ({ size, setSize }) => (
  <div className="flex items-center gap-2 bg-stone-100/80 rounded-full p-1 shadow-sm border border-stone-200 backdrop-blur-sm">
    <button 
      onClick={() => setSize(Math.max(0, size - 1))}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${size === 0 ? 'text-stone-300' : 'text-teal-700 hover:bg-white'}`}
      disabled={size === 0}
      title="Perkecil Teks"
    >
      <span className="text-xs font-bold">A-</span>
    </button>
    <div className="w-px h-4 bg-stone-300"></div>
    <button 
      onClick={() => setSize(Math.min(3, size + 1))}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${size === 3 ? 'text-stone-300' : 'text-teal-700 hover:bg-white'}`}
      disabled={size === 3}
      title="Perbesar Teks"
    >
      <span className="text-lg font-bold">A+</span>
    </button>
  </div>
);

// Audio Player Component
const AudioPlayer: React.FC<{ surahRef: number; ayahRef: number }> = ({ surahRef, ayahRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioUrl) {
        setIsLoadingAudio(true);
        try {
          // Fetch audio URL from Al-Quran Cloud API (Mishary Alafasy)
          const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahRef}:${ayahRef}/ar.alafasy`);
          const data = await response.json();
          if (data.data && data.data.audio) {
            setAudioUrl(data.data.audio);
            // Wait for state update then play
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                    setIsPlaying(true);
                }
            }, 100);
          }
        } catch (e) {
          console.error("Audio fetch failed", e);
        } finally {
          setIsLoadingAudio(false);
        }
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="mt-6 flex justify-center">
        {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
        
        <button 
          onClick={togglePlay}
          className={`
            flex items-center gap-2 px-5 py-2 rounded-full shadow-md transition-all duration-300
            ${isPlaying 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'bg-teal-700 text-white hover:bg-teal-800'
            }
          `}
        >
            {isLoadingAudio ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : isPlaying ? (
                <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    <span className="text-sm font-bold">Jeda</span>
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span className="text-sm font-bold">Dengar Ayat</span>
                </>
            )}
        </button>
    </div>
  );
};

export const TadabburCard: React.FC<TadabburCardProps> = ({ 
  content, 
  track, 
  onUpdateTrack,
  onCompleteDay,
  isLoading = false,
  isOnline = true
}) => {
  const [localNotes, setLocalNotes] = useState(track?.notes || "");
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0=Small, 1=Normal, 2=Large, 3=XL

  // Check if all tasks are completed
  const isAllTasksCompleted = track?.tadabburRead && track?.practiceDone && track?.duaDone;

  // Font Size Classes Mapping
  const arabicSizes = ["text-3xl md:text-4xl", "text-4xl md:text-5xl", "text-5xl md:text-6xl", "text-6xl md:text-7xl"];
  const translationSizes = ["text-base", "text-lg", "text-xl", "text-2xl"];
  const bodySizes = ["text-base", "text-lg", "text-xl", "text-2xl"];

  // Loading messages sequence
  const loadingMessages = [
    "Membuka lembaran ayat...",
    "Menggali hikmah mendalam...",
    "Menyiapkan panduan amalan...",
    "Mencari hadis penyejuk hati..."
  ];

  useEffect(() => {
    setLocalNotes(track?.notes || "");
  }, [track?.notes]);

  // Cycle loading messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
    setLoadingMsgIndex(0);
  }, [isLoading]);

  const handleNoteBlur = () => {
    if (localNotes !== track?.notes) {
      onUpdateTrack({ notes: localNotes });
    }
  };

  const handleManualSubmit = () => {
    if (localNotes !== track?.notes) {
      onUpdateTrack({ notes: localNotes });
    }
    
    setIsSaved(true);
    
    // Navigate after delay if completed
    setTimeout(() => {
      if (isAllTasksCompleted) {
        setIsExiting(true);
        setTimeout(() => {
          onCompleteDay();
        }, 600);
      } else {
        setIsSaved(false);
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>

        {/* Islamic Geometric Spinner */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_8s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-teal-200 drop-shadow-md">
              <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" fill="currentColor" opacity="0.6" />
              <rect x="20" y="20" width="60" height="60" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_4s_linear_infinite_reverse]">
             <svg viewBox="0 0 100 100" className="w-16 h-16 text-teal-600">
               <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke="currentColor" strokeWidth="2" fill="none" />
               <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="2" fill="none" />
               <circle cx="50" cy="50" r="8" fill="#f59e0b" />
             </svg>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-center z-10 h-16">
          <h3 className="text-xl font-serif-text font-bold text-teal-900 mb-2 animate-[pulse_2s_ease-in-out_infinite]">
            Menjemput Ilmu
          </h3>
          <p className="text-stone-500 text-sm font-medium transition-opacity duration-500 ease-in-out">
            {loadingMessages[loadingMsgIndex]}
          </p>
        </div>
      </div>
    );
  }

  const praktikSteps = content.praktik || [];
  const reflectionQs = content.reflectionQuestions || [];

  return (
    <div 
      className={`max-w-2xl mx-auto px-4 py-8 pb-32 space-y-8 transform transition-all duration-700 ease-in-out ${
      isExiting 
        ? 'opacity-0 translate-y-12 scale-95 blur-sm' 
        : 'opacity-100 translate-y-0 scale-100 blur-0'
    }`}>
      
      {/* 1. Ayat Card */}
      <section className="bg-white rounded-t-3xl rounded-b-lg shadow-lg border border-stone-100 overflow-hidden relative group">
         <div className="bg-teal-50 px-6 py-3 border-b border-teal-100 flex justify-between items-center relative z-10">
            <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">Hari ke-{content.day}</span>
            <div className="flex items-center gap-3">
               {!isOnline && (
                 <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded">Offline Mode</span>
               )}
               {/* Font Controller */}
               <FontController size={fontSizeLevel} setSize={setFontSizeLevel} />
            </div>
         </div>

         <div className="p-8 text-center relative">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
              </svg>
            </div>

            <div className="mb-6 font-serif-text text-teal-800 font-semibold text-sm tracking-wide">
              {content.surahName} : {content.ayahNumber}
            </div>

            <h2 
              className={`font-arabic text-teal-900 mb-8 dir-rtl py-2 leading-relaxed transition-all duration-300 ${arabicSizes[fontSizeLevel]}`} 
              dir="rtl"
            >
              {content.arabicText}
            </h2>
            
            <p className={`text-stone-600 font-serif-text italic leading-relaxed transition-all duration-300 ${translationSizes[fontSizeLevel]}`}>
              "{content.translation}"
            </p>

            {/* Audio Player if references exist */}
            {content.surahRef && content.ayahRef && (
                <AudioPlayer surahRef={content.surahRef} ayahRef={content.ayahRef} />
            )}
         </div>
      </section>

      <OrnamentalDivider />

      {/* 2. Hikmah Tadabbur */}
      <section>
        <div className="text-center mb-6">
          <h3 className="font-serif-text text-2xl font-bold text-teal-900">Hikmah Tadabbur</h3>
          <div className="w-12 h-1 bg-amber-400 mx-auto mt-2 rounded-full"></div>
        </div>
        <div className={`bg-[#FFFDF5] p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 text-stone-700 font-serif-text transition-all duration-300 leading-relaxed ${bodySizes[fontSizeLevel]}`}>
          {content.hikmah}
        </div>
      </section>

      {/* 3. Action Grid */}
      <div className="grid gap-6">
        {/* Praktik */}
        <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-6">
          <h3 className="flex items-center gap-3 font-bold text-teal-900 mb-4 font-serif-text text-lg">
            <span className="bg-teal-200 text-teal-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">✦</span>
            Praktik Hari Ini
          </h3>
          <ul className="space-y-4">
            {praktikSteps.map((step, idx) => (
              <li key={idx} className={`flex gap-4 text-stone-700 items-start ${bodySizes[fontSizeLevel] === 'text-2xl' ? 'text-xl' : 'text-base'}`}>
                <span className="font-arabic text-teal-500 font-bold text-xl mt-[-4px]">.</span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hadith */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
          <h3 className="font-bold text-stone-800 mb-4 font-serif-text text-lg relative z-10">Hadis Pilihan</h3>
          <p className={`text-stone-800 font-serif-text italic mb-3 relative z-10 transition-all duration-300 ${bodySizes[fontSizeLevel]}`}>
            "{content.hadithText}"
          </p>
          <p className="text-amber-700 text-xs font-bold uppercase tracking-widest text-right relative z-10">— {content.hadithSource}</p>
        </div>
      </div>

      {/* 4. Refleksi */}
      <section className="bg-gradient-to-r from-teal-50 to-white rounded-r-xl border-l-4 border-teal-600 pl-6 py-4 pr-4 shadow-sm">
         <h3 className="text-lg font-bold text-teal-900 mb-4 font-serif-text flex items-center gap-2">
            Renungan Diri
         </h3>
         <ul className="space-y-4">
           {reflectionQs.map((q, idx) => (
             <li key={idx} className="flex gap-3 items-start group">
               <div className="mt-1 shrink-0 text-teal-400 group-hover:text-amber-500 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
                 </svg>
               </div>
               <span className={`text-stone-600 italic font-serif-text leading-relaxed transition-all duration-300 ${bodySizes[fontSizeLevel]}`}>
                 {q}
               </span>
             </li>
           ))}
         </ul>
      </section>

      {/* 5. Tracker Card */}
      <section className="bg-teal-900 text-teal-50 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden ring-4 ring-stone-200">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-700 via-amber-400 to-teal-700"></div>
        
        <h3 className="text-2xl font-serif-text font-bold text-amber-50 mb-8 text-center flex items-center justify-center gap-2">
          <span>📖</span> Jurnal Amalan
        </h3>
        
        <div className="space-y-6">
          <div className="grid gap-3">
            {[
              { key: 'tadabburRead', label: 'Membaca Tadabbur', icon: '👀' },
              { key: 'practiceDone', label: 'Melakukan Praktik', icon: '🤲' },
              { key: 'duaDone', label: 'Berdoa Khusyuk', icon: '📿' }
            ].map((item) => (
              <label key={item.key} className={`
                flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none
                ${track[item.key as keyof DailyTrack] 
                  ? 'bg-teal-800 border-amber-500/50 shadow-inner' 
                  : 'bg-teal-900 border-teal-700 hover:bg-teal-800'
                }
              `}>
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-80">{item.icon}</span>
                  <span className={`font-medium ${track[item.key as keyof DailyTrack] ? 'text-amber-50' : 'text-teal-300'}`}>
                    {item.label}
                  </span>
                </div>
                
                <div className={`
                  w-6 h-6 rounded-full border flex items-center justify-center transition-all
                  ${track[item.key as keyof DailyTrack] ? 'bg-amber-500 border-amber-500' : 'border-teal-600'}
                `}>
                  {track[item.key as keyof DailyTrack] && (
                    <svg className="w-4 h-4 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={!!track[item.key as keyof DailyTrack]}
                  onChange={(e) => onUpdateTrack({ [item.key]: e.target.checked })}
                />
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-teal-800">
             <label className="block text-teal-300 text-sm font-bold uppercase tracking-wider mb-3">Catatan Hati (Opsional)</label>
             <textarea
                className="w-full bg-teal-950/50 border border-teal-800 rounded-lg p-4 text-stone-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none min-h-[120px] text-sm leading-relaxed placeholder-teal-700/50 font-serif-text"
                placeholder="Tuliskan renunganmu di sini..."
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                onBlur={handleNoteBlur}
             ></textarea>
          </div>

          <div className="pt-4">
            <button
              onClick={handleManualSubmit}
              disabled={isSaved}
              className={`
                w-full relative overflow-hidden group py-4 px-6 rounded-xl font-serif-text font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg
                ${isSaved 
                  ? 'bg-emerald-700 text-emerald-100 cursor-default scale-100' 
                  : isAllTasksCompleted 
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-teal-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1' 
                    : 'bg-teal-700 text-teal-100 hover:bg-teal-600'
                }
              `}
            >
              {/* Shine Effect */}
              {isAllTasksCompleted && !isSaved && (
                <div className="absolute top-0 -left-full w-full h-full bg-white/40 skew-x-[25deg] animate-[shine_2s_infinite]"></div>
              )}
              <style>{`
                @keyframes shine {
                  100% { left: 125%; }
                }
              `}</style>

              <div className="relative flex items-center justify-center gap-2">
                {isSaved ? (
                  <>
                    <span className="text-xl animate-bounce">✨</span>
                    <span className="animate-[fadeIn_0.3s_ease-out]">
                      {isAllTasksCompleted ? "Jurnal Disimpan!" : "Progres Tersimpan"}
                    </span>
                  </>
                ) : (
                  <>
                    {isAllTasksCompleted ? (
                       <>
                         <span>Submit Jurnal Hari Ini</span>
                         <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                         </svg>
                       </>
                    ) : (
                       <>
                         <span>Simpan Progres</span>
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                         </svg>
                       </>
                    )}
                  </>
                )}
              </div>
            </button>
            {isAllTasksCompleted && !isSaved && (
              <p className="text-center text-teal-300/70 text-xs mt-3 font-serif-text italic animate-[fadeIn_0.5s_ease-out]">
                Klik tombol di atas untuk melanjutkan ke hari berikutnya
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};