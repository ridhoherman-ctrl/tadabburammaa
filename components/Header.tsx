import React from 'react';

interface HeaderProps {
  completedCount: number;
  totalDays: number;
  onHomeClick: () => void;
  onJournalClick: () => void;
  isOnline: boolean;
  isLoading: boolean;
}

const MiniTree: React.FC<{ count: number; className?: string }> = ({ count, className = "w-6 h-6" }) => {
  const trunkColor = "#e7e5e4"; // stone-200
  const leafColor = "#5eead4"; // teal-300
  const fruitColor = "#fcd34d"; // amber-300
  const fruitColorRipe = "#f59e0b"; // amber-500
  const fruitColorMaster = "#fffbeb"; // amber-50

  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-sm ${className}`}>
      {/* Trunk */}
      <path d="M12 22V14" stroke={trunkColor} strokeWidth="2" strokeLinecap="round" />
      
      {/* Branches base if barren */}
      {count === 0 && (
        <>
            <path d="M12 14L9 10" stroke={trunkColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 14L15 10" stroke={trunkColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17L14 15" stroke={trunkColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {count > 0 && count < 10 && (
         // Sprouting
         <>
           <path d="M12 14L12 11" stroke={trunkColor} strokeWidth="2" strokeLinecap="round" />
           <circle cx="12" cy="10" r="3" fill={leafColor} />
           <circle cx="9" cy="13" r="2" fill={leafColor} />
           <circle cx="15" cy="13" r="2" fill={leafColor} />
         </>
      )}

      {count >= 10 && (
         // Lush Canopy
         <path d="M12 15C16.5 15 20 11.5 20 7C20 4.5 18 2 12 2C6 2 4 4.5 4 7C4 11.5 7.5 15 12 15Z" fill={leafColor} fillOpacity="0.9" />
      )}

      {count >= 25 && count < 80 && (
         // Fruits
         <>
           <circle cx="9" cy="8" r="1.5" fill={fruitColor} />
           <circle cx="16" cy="7" r="1.5" fill={fruitColor} />
         </>
      )}
      
      {count >= 50 && count < 80 && (
          // More fruits
          <>
            <circle cx="12.5" cy="5" r="1.5" fill={fruitColorRipe} />
            <circle cx="10" cy="11" r="1.5" fill={fruitColorRipe} />
          </>
      )}

      {count >= 80 && (
          // Master / Golden Fruits
          <>
            <circle cx="9" cy="8" r="1.5" fill={fruitColorMaster} stroke={fruitColorRipe} strokeWidth="0.5" />
            <circle cx="16" cy="7" r="1.5" fill={fruitColorMaster} stroke={fruitColorRipe} strokeWidth="0.5" />
            <circle cx="12.5" cy="5" r="1.5" fill={fruitColorMaster} stroke={fruitColorRipe} strokeWidth="0.5" />
            <circle cx="10" cy="11" r="1.5" fill={fruitColorMaster} stroke={fruitColorRipe} strokeWidth="0.5" />
            <circle cx="14" cy="10" r="1.5" fill={fruitColorMaster} stroke={fruitColorRipe} strokeWidth="0.5" />
          </>
      )}
    </svg>
  );
};

export const Header: React.FC<HeaderProps> = ({ 
  completedCount, 
  totalDays, 
  onHomeClick,
  onJournalClick,
  isOnline,
  isLoading 
}) => {
  const progressPercentage = Math.round((completedCount / totalDays) * 100);

  return (
    <header className="sticky top-0 z-50 bg-teal-900 text-stone-50 shadow-md border-b border-teal-800/50">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div className="w-10 h-10 bg-teal-800 rounded-full flex items-center justify-center border border-teal-600 shadow-inner group-hover:bg-teal-700 transition-colors relative overflow-hidden">
               {/* Background glow for high levels */}
               {completedCount >= 50 && <div className="absolute inset-0 bg-amber-500/10 blur-md"></div>}
               <MiniTree count={completedCount} className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="font-serif-text font-bold text-lg leading-tight tracking-tight text-stone-100">
                99 Hari Tadabbur
              </h1>
              <p className="text-[10px] text-teal-300/90 font-medium uppercase tracking-widest">Juz Amma Journey</p>
            </div>
          </button>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={onJournalClick}
                className="hidden sm:flex items-center gap-2 bg-teal-800 hover:bg-teal-700 text-teal-100 px-3 py-1.5 rounded-lg transition-colors border border-teal-700 shadow-sm group"
                title="Buka Jurnal"
             >
                <span className="text-lg group-hover:scale-110 transition-transform">📖</span>
                <span className="text-xs font-bold uppercase tracking-wider">Jurnal</span>
             </button>
             {/* Mobile only icon for Journal */}
             <button 
                onClick={onJournalClick}
                className="sm:hidden w-8 h-8 flex items-center justify-center bg-teal-800 rounded-full text-teal-100 border border-teal-700 hover:bg-teal-700 transition-colors"
             >
               📖
             </button>

             <div className="flex items-center gap-2">
                {/* Status Indicators */}
                <div className="flex flex-col items-end gap-1">
                   {isLoading && (
                     <span className="flex h-2 w-2 relative" title="Loading...">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                     </span>
                   )}
                   {!isOnline && (
                     <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                       OFF
                     </span>
                   )}
                </div>

                {/* Visual Progress Badge */}
                <div className="pl-1 sm:pl-2">
                  <div className="flex items-center gap-2 bg-teal-950/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-teal-700/50 hover:bg-teal-900/50 transition-colors group cursor-default">
                     <div className="relative w-8 h-8 flex items-center justify-center">
                        {/* Glow effect for badge tree */}
                        {completedCount > 0 && (
                          <div className="absolute inset-0 bg-teal-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        )}
                        <MiniTree count={completedCount} className="w-7 h-7" />
                     </div>
                     
                     <div className="flex flex-col -space-y-0.5">
                        <span className="hidden sm:block text-[9px] text-teal-400 uppercase tracking-widest font-bold">Capaian</span>
                        <span className="text-xs sm:text-sm font-serif-text font-bold text-stone-100 leading-tight">
                            <span className="text-amber-400">{completedCount}</span>
                            <span className="text-teal-600 text-[10px] sm:text-xs">/{totalDays}</span>
                        </span>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-teal-950/50 rounded-full h-1.5 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(251,191,36,0.3)]" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
          {isLoading && (
            <div className="absolute inset-0 bg-white/10 animate-pulse w-full"></div>
          )}
        </div>
      </div>
    </header>
  );
};