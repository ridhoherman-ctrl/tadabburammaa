import React from 'react';

interface DaySelectorProps {
  totalDays: number;
  completedDays: number[];
  onSelectDay: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ totalDays, completedDays, onSelectDay }) => {
  // Determine the next day to unlock
  const maxCompleted = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const currentDay = Math.min(maxCompleted + 1, totalDays);
  const isAllComplete = completedDays.length >= totalDays;

  // Sort completed days for history view
  const historyDays = [...completedDays].sort((a, b) => a - b);

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-6 py-8 pb-32 max-w-lg mx-auto relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-teal-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 bg-amber-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-10 mt-4 animate-[fadeIn_0.8s_ease-out]">
        <h2 className="font-arabic text-4xl text-teal-900 mb-2">
           بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4"></div>
        <p className="text-stone-500 font-serif-text italic text-sm md:text-base max-w-xs mx-auto leading-relaxed">
          {currentDay === 1 
            ? "Mulai perjalanan 99 hari menyentuh hati dengan cahaya Al-Quran."
            : "Setiap ayat adalah satu langkah mendekat. Pertahankan istiqomahmu."}
        </p>
      </div>

      {/* Main Action Card (The Next Step) */}
      {!isAllComplete ? (
        <div className="w-full relative group perspective-1000 mb-12">
           <button
             onClick={() => onSelectDay(currentDay)}
             className="w-full relative bg-white rounded-2xl border border-stone-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
           >
              {/* Card Decoration */}
              <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="p-8 py-12 flex flex-col items-center justify-center relative z-10">
                <span className="text-xs font-bold tracking-[0.2em] text-teal-600 uppercase mb-3">
                  Perjalanan Hari Ini
                </span>
                
                <h1 className="text-6xl font-serif-text font-bold text-teal-900 mb-2 group-hover:scale-110 transition-transform duration-500">
                  {currentDay}
                </h1>
                
                <div className="flex items-center gap-2 text-stone-400 text-sm mb-8">
                  <span className="w-8 h-px bg-stone-300"></span>
                  <span className="font-serif-text italic">dari {totalDays} hari</span>
                  <span className="w-8 h-px bg-stone-300"></span>
                </div>

                <div className="px-8 py-3 bg-teal-900 text-amber-50 rounded-full font-medium shadow-lg group-hover:bg-teal-800 transition-colors flex items-center gap-2">
                  <span>{currentDay === 1 ? "Mulai Tadabbur" : "Lanjutkan Tadabbur"}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
           </button>
           
           {/* Shadow Pulse */}
           <div className="absolute inset-0 rounded-2xl bg-teal-400/20 blur-xl -z-10 animate-pulse"></div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-2xl border border-teal-100 shadow-lg mb-10">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-teal-900 mb-2 font-serif-text">Masya Allah Tabarakallah</h3>
          <p className="text-stone-600">Anda telah menyelesaikan perjalanan 99 hari ini.</p>
        </div>
      )}

      {/* History / Previous Days */}
      {historyDays.length > 0 && (
        <div className="w-full mt-4 animate-[slideUp_0.5s_ease-out]">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-stone-200 flex-1"></div>
            <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Jejak Langkah</span>
            <div className="h-px bg-stone-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {historyDays.map((day) => (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className="aspect-square rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 hover:border-teal-300 transition-all flex flex-col items-center justify-center shadow-sm hover:shadow-md group relative overflow-hidden"
              >
                <span className="font-serif-text font-bold text-lg">{day}</span>
                <div className="absolute bottom-0 right-0 p-1 opacity-50 group-hover:opacity-100">
                  <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aesthetic decorative quote at bottom */}
      <div className="mt-auto pt-16 text-center opacity-60">
        <p className="font-serif-text italic text-stone-400 text-xs">
          "Barangsiapa menempuh jalan untuk mencari ilmu, <br/>maka Allah akan mudahkan baginya jalan menuju surga."
        </p>
      </div>

    </div>
  );
};