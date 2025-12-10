import React, { useRef, useState, useEffect } from 'react';
import { DailyContent, DailyTrack } from '../types';

interface JournalViewProps {
  tracker: Record<number, DailyTrack>;
  cachedContent: Record<number, DailyContent>;
  onNavigateToDay: (day: number) => void;
  onBack: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const TreeVisual: React.FC<{ count: number }> = ({ count }) => {
  // Logic for tree state
  const hasLeaves = count > 0;
  const isLush = count >= 10;
  const hasFruits = count >= 25;
  const isAbundant = count >= 50;
  const isMaster = count >= 80;

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-[#f0fdfa] to-[#fafaf9] rounded-3xl border border-teal-100/50 shadow-inner mb-6 relative overflow-hidden group">
       {/* Internal Styles for specific SVG animations */}
       <style>{`
         @keyframes sway {
           0%, 100% { transform: rotate(-1deg); }
           50% { transform: rotate(1deg); }
         }
         @keyframes leafSpring {
           0% { transform: scale(0); opacity: 0; }
           60% { transform: scale(1.15); opacity: 1; }
           100% { transform: scale(1); opacity: 1; }
         }
         @keyframes fruitDropElastic {
           0% { transform: translateY(-20px) scale(0); opacity: 0; }
           40% { transform: translateY(0) scale(1.1); opacity: 1; }
           60% { transform: translateY(-4px) scale(0.95); }
           80% { transform: translateY(1px) scale(1.02); }
           100% { transform: translateY(0) scale(1); opacity: 1; }
         }
         .tree-sway {
           animation: sway 6s ease-in-out infinite;
           transform-origin: bottom center;
         }
         .anim-elem {
           transform-box: fill-box;
           transform-origin: center;
           opacity: 0; /* Start hidden for animation */
         }
         .fruit-elem {
           transform-box: fill-box;
           transform-origin: top center;
           opacity: 0;
         }
       `}</style>

       {/* Ambient Light Effect */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -z-10 transition-all duration-1000 group-hover:bg-amber-200/40"></div>

       {/* SVG Tree */}
       <svg width="220" height="240" viewBox="0 0 200 220" className="drop-shadow-xl tree-sway">
          {/* Ground */}
          <ellipse cx="100" cy="210" rx="80" ry="8" fill="#d6d3d1" />
          
          {/* Trunk & Branches (Base Layer) */}
          <g stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none">
             {/* Main Trunk */}
             <path d="M100 210 L100 160" strokeWidth="14" stroke="#5D4037" />
             <path d="M100 160 L100 110" strokeWidth="10" stroke="#5D4037" />
             
             {/* Left Branches */}
             <path d="M100 160 Q70 140 50 150" strokeWidth="6" stroke="#6D4C41" />
             <path d="M100 130 Q60 120 40 90" strokeWidth="5" stroke="#6D4C41" />
             <path d="M50 150 L40 140" strokeWidth="3" />

             {/* Right Branches */}
             <path d="M100 150 Q130 140 160 160" strokeWidth="6" stroke="#6D4C41" />
             <path d="M100 120 Q140 110 170 80" strokeWidth="5" stroke="#6D4C41" />
             <path d="M160 160 L170 150" strokeWidth="3" />
             
             {/* Top Branches */}
             <path d="M100 110 Q80 70 90 40" strokeWidth="5" stroke="#6D4C41" />
             <path d="M100 110 Q120 70 110 40" strokeWidth="5" stroke="#6D4C41" />
          </g>

          {/* Leaves Layer 1 (Sprouting) - Staggered */}
          {hasLeaves && [
             { cx: 40, cy: 90, r: 12 }, { cx: 170, cy: 80, r: 12 }, 
             { cx: 90, cy: 40, r: 15 }, { cx: 110, cy: 40, r: 12 }, 
             { cx: 50, cy: 150, r: 8 }, { cx: 160, cy: 160, r: 8 }
          ].map((leaf, i) => (
             <circle 
               key={`leaf1-${i}`}
               cx={leaf.cx} cy={leaf.cy} r={leaf.r} 
               fill="#5eead4" 
               className="anim-elem"
               style={{ animation: `leafSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s forwards` }}
             />
          ))}

          {/* Leaves Layer 2 (Lush) - Staggered */}
          {isLush && [
             { cx: 70, cy: 70, r: 25, fill: "#14b8a6" },
             { cx: 130, cy: 60, r: 28, fill: "#14b8a6" },
             { cx: 100, cy: 90, r: 30, fill: "#0d9488" },
             { cx: 30, cy: 110, r: 18, fill: "#2dd4bf" },
             { cx: 180, cy: 100, r: 18, fill: "#2dd4bf" },
             { cx: 100, cy: 50, r: 35, fill: "#0f766e" }
          ].map((leaf, i) => (
             <circle 
               key={`leaf2-${i}`}
               cx={leaf.cx} cy={leaf.cy} r={leaf.r} 
               fill={leaf.fill}
               className="anim-elem"
               style={{ animation: `leafSpring 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + (i * 0.12)}s forwards` }}
             />
          ))}

          {/* Fruits Layer 1 - Dropping in with physics */}
          {hasFruits && [
             { cx: 70, cy: 70 }, { cx: 130, cy: 60 }, 
             { cx: 100, cy: 40 }, { cx: 50, cy: 100 }
          ].map((fruit, i) => (
             <g key={`fruit1-${i}`} className="fruit-elem" style={{ animation: `fruitDropElastic 0.8s ease-out ${0.2 + (i * 0.15)}s forwards` }}>
                <circle cx={fruit.cx} cy={fruit.cy} r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                {/* Stem */}
                <path d={`M${fruit.cx} ${fruit.cy-6} L${fruit.cx} ${fruit.cy-9}`} stroke="#78350f" strokeWidth="1" />
             </g>
          ))}

          {/* Fruits Layer 2 (Abundant) */}
          {isAbundant && [
             { cx: 40, cy: 90 }, { cx: 170, cy: 80 }, 
             { cx: 90, cy: 100 }, { cx: 110, cy: 70 }, 
             { cx: 150, cy: 110 }
          ].map((fruit, i) => (
             <g key={`fruit2-${i}`} className="fruit-elem" style={{ animation: `fruitDropElastic 0.8s ease-out ${0.6 + (i * 0.15)}s forwards` }}>
                <circle cx={fruit.cx} cy={fruit.cy} r="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                <path d={`M${fruit.cx} ${fruit.cy-6} L${fruit.cx} ${fruit.cy-9}`} stroke="#78350f" strokeWidth="1" />
             </g>
          ))}
          
          {/* Master Fruits (Golden) */}
          {isMaster && [
             { cx: 100, cy: 20 }, { cx: 20, cy: 120 }, { cx: 190, cy: 110 }
          ].map((fruit, i) => (
             <g key={`fruitMaster-${i}`} className="fruit-elem" style={{ animation: `fruitDropElastic 1s ease-out ${1.0 + (i * 0.2)}s forwards` }}>
                <circle cx={fruit.cx} cy={fruit.cy} r="6" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
                {/* Shine sparkle */}
                <path d={`M${fruit.cx-2} ${fruit.cy-2} L${fruit.cx+2} ${fruit.cy+2} M${fruit.cx+2} ${fruit.cy-2} L${fruit.cx-2} ${fruit.cy+2}`} stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
             </g>
          ))}
       </svg>
       
       <div className="mt-6 text-center w-full px-8 relative z-10">
         <h4 className="font-serif-text font-bold text-teal-900 text-xl mb-1 transition-all duration-500 animate-[fadeIn_1s_ease-out]">
           {count === 0 ? "Pohon Gersang" : 
            count < 10 ? "Mulai Bersemi" :
            count < 25 ? "Tumbuh Subur" :
            count < 50 ? "Mulai Berbuah" : "Panen Raya"}
         </h4>
         <p className="text-teal-600/70 text-xs uppercase tracking-widest font-bold mb-4">
           {count} Catatan Terkumpul
         </p>
         
         {/* Custom Progress Bar */}
         <div className="w-full max-w-xs mx-auto h-2 bg-stone-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-amber-400 transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min((count / 99) * 100, 100)}%` }} 
            ></div>
         </div>
         <p className="text-[10px] text-stone-400 mt-2 italic">Target: 99 Catatan untuk pohon yang sempurna</p>
       </div>
    </div>
  );
};

// Statistics Chart Component
const StatsChart: React.FC<{ 
  readCount: number; 
  practiceCount: number; 
  duaCount: number; 
}> = ({ readCount, practiceCount, duaCount }) => {
  const maxVal = 99; // Target total
  
  const stats = [
    { 
      label: 'Tadabbur', 
      icon: '👀', 
      count: readCount, 
      color: 'bg-teal-500', 
      bg: 'bg-teal-100',
      textColor: 'text-teal-700'
    },
    { 
      label: 'Praktik', 
      icon: '🤲', 
      count: practiceCount, 
      color: 'bg-emerald-500', 
      bg: 'bg-emerald-100',
      textColor: 'text-emerald-700'
    },
    { 
      label: 'Doa', 
      icon: '📿', 
      count: duaCount, 
      color: 'bg-amber-500', 
      bg: 'bg-amber-100',
      textColor: 'text-amber-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-10 animate-[fadeIn_0.6s_ease-out]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif-text font-bold text-stone-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Statistik Amalan
        </h3>
        <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">
          Total 99 Hari
        </span>
      </div>

      <div className="flex justify-around items-end h-48 gap-4 sm:gap-8">
        {stats.map((stat, idx) => {
          const percentage = Math.round((stat.count / maxVal) * 100);
          const heightPercent = Math.max(percentage, 2); // Min height 2%

          return (
            <div key={stat.label} className="flex-1 flex flex-col items-center group">
              {/* Tooltip / Value on top */}
              <div className={`mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-xs font-bold ${stat.textColor}`}>
                {percentage}%
              </div>
              
              {/* Bar Container */}
              <div className={`w-full max-w-[60px] h-full ${stat.bg} rounded-t-xl relative overflow-hidden flex items-end`}>
                 {/* The Bar */}
                 <div 
                   className={`w-full ${stat.color} rounded-t-lg transition-all duration-1000 ease-out group-hover:brightness-110 relative`}
                   style={{ height: `${heightPercent}%` }}
                 >
                    {/* Gloss Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
                 </div>
              </div>
              
              {/* Labels below */}
              <div className="mt-3 text-center">
                <div className="text-xl mb-1 filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-xs font-bold text-stone-600 mb-0.5">{stat.label}</div>
                <div className={`text-xs font-bold ${stat.textColor}`}>{stat.count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Loading Component
const JournalSkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl border border-stone-100 shadow-sm p-6 relative overflow-hidden h-40">
         {/* Shimmer Effect */}
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-stone-50/60 to-transparent z-10"></div>
         
         <div className="flex justify-between items-start mb-4 border-b border-stone-100 pb-3">
           <div className="space-y-2 w-2/3">
             <div className="h-3 w-16 bg-teal-100 rounded-full"></div>
             <div className="h-6 w-3/4 bg-stone-200 rounded"></div>
           </div>
           <div className="w-8 h-8 rounded-full bg-stone-100"></div>
         </div>
         
         <div className="space-y-2 pl-6 border-l-2 border-stone-100">
           <div className="h-3 w-full bg-stone-100 rounded"></div>
           <div className="h-3 w-full bg-stone-100 rounded"></div>
           <div className="h-3 w-2/3 bg-stone-100 rounded"></div>
         </div>
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

export const JournalView: React.FC<JournalViewProps> = ({ 
  tracker, 
  cachedContent, 
  onNavigateToDay, 
  onBack,
  onExportData,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate statistics
  const { readCount, practiceCount, duaCount } = Object.values(tracker).reduce(
    (acc, t) => ({
      readCount: acc.readCount + (t.tadabburRead ? 1 : 0),
      practiceCount: acc.practiceCount + (t.practiceDone ? 1 : 0),
      duaCount: acc.duaCount + (t.duaDone ? 1 : 0),
    }),
    { readCount: 0, practiceCount: 0, duaCount: 0 }
  );

  // Filter entries that have non-empty notes and sort by day
  const entries = Object.entries(tracker)
    .map(([dayStr, track]) => ({
      day: parseInt(dayStr),
      notes: track.notes,
      track
    }))
    .filter(entry => entry.notes && entry.notes.trim().length > 0)
    .sort((a, b) => a.day - b.day);

  // Simulate loading delay for aesthetic transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportData(e.target.files[0]);
    }
    // Reset value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-serif-text font-bold text-teal-900">Jurnal Tadabbur</h2>
          <p className="text-stone-500 text-sm">Rekaman jejak hati dan pikiran Anda</p>
        </div>
      </div>

      {/* Tree Visualizer at the top */}
      <TreeVisual count={entries.length} />

      {/* Statistics Chart */}
      <StatsChart 
        readCount={readCount} 
        practiceCount={practiceCount} 
        duaCount={duaCount} 
      />

      {/* Journal Entries List */}
      <div className="mb-12">
        <h3 className="text-teal-800 font-bold font-serif-text text-xl border-b border-stone-200 pb-2 mb-4">
            Riwayat Catatan
        </h3>

        {isLoading ? (
          <JournalSkeletonLoader />
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 shadow-sm mx-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-5xl mb-4 opacity-30 grayscale animate-pulse">🍂</div>
            <h3 className="text-lg font-bold text-stone-700 mb-2 font-serif-text">Belum ada buah pikiran</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
              Sirami pohon ini dengan menulis refleksi Anda setiap hari di bagian "Catatan Hati".
            </p>
            <button 
              onClick={onBack} 
              className="px-6 py-2 bg-teal-700 text-white rounded-full font-medium hover:bg-teal-800 transition-colors shadow-lg text-sm"
            >
              Mulai Menulis
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {entries.map((entry, idx) => (
              <div 
                key={entry.day} 
                className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 relative group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Decorative side bar */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-500 to-amber-400"></div>
                
                <div className="p-6 pl-8">
                  <div className="flex justify-between items-start mb-4 border-b border-stone-100 pb-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-1">Hari ke-{entry.day}</span>
                      {cachedContent[entry.day] ? (
                        <span className="text-lg font-serif-text font-bold text-teal-900">
                          {cachedContent[entry.day].surahName} <span className="text-stone-400 font-normal text-sm">: {cachedContent[entry.day].ayahNumber}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-stone-400 italic">Data tadabbur belum terunduh</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => onNavigateToDay(entry.day)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide group/btn"
                      title="Lihat Ayat"
                    >
                      <span>Lihat Ayat</span>
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative">
                    <svg className="absolute -top-2 -left-2 w-6 h-6 text-stone-200 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M14.017 21L14.017 18C14.017 16.0547 14.8093 14.1906 16.2198 12.8198C17.6303 11.449 19.5445 10.6783 21.5432 10.6783V6.37653C17.9625 6.37653 14.5367 7.79471 12.0048 10.2555C9.47291 7.79471 6.04712 6.37653 2.46643 6.37653V10.6783C4.46513 10.6783 6.37929 11.449 7.78985 12.8198C9.2004 14.1906 9.99266 16.0547 9.99266 18V21H0V2H24V21H14.017Z" />
                    </svg>
                    <p className="font-serif-text text-stone-700 leading-relaxed whitespace-pre-line pl-6 relative z-10 text-lg">
                      {entry.notes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management Section */}
      <div className="bg-stone-100 rounded-xl p-6 border border-stone-200 mt-12">
        <h3 className="font-serif-text font-bold text-stone-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          Manajemen Data
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Amankan progress tadabbur Anda dengan mengunduh file backup, atau pulihkan data Anda jika berganti perangkat.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onExportData}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Backup
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button 
              className="w-full h-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0L8 8m4-4v12" /></svg>
              Restore Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};