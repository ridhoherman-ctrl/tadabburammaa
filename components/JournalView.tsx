import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DailyContent, DailyTrack } from '../types';

interface JournalViewProps {
  tracker: Record<number, DailyTrack>;
  cachedContent: Record<number, DailyContent>;
  onNavigateToDay: (day: number) => void;
  onBack: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

// --- Summary Tree (Visual Statis di Header) ---
const SummaryTree: React.FC<{ count: number }> = ({ count }) => {
  const hasLeaves = count > 0;
  const isLush = count >= 10;
  const hasFruits = count >= 25;
  const isMaster = count >= 80;

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-[#f0fdfa] to-[#fafaf9] rounded-3xl border border-teal-100/50 shadow-inner mb-8 relative overflow-hidden">
       {/* Ambient Light */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -z-10"></div>

       {/* Simple SVG Tree for Header Summary */}
       <svg width="120" height="140" viewBox="0 0 200 220" className="drop-shadow-md">
          <ellipse cx="100" cy="210" rx="60" ry="6" fill="#d6d3d1" />
          <path d="M100 210 L100 140" strokeWidth="12" stroke="#5D4037" strokeLinecap="round" />
          <path d="M100 140 L100 80" strokeWidth="8" stroke="#5D4037" strokeLinecap="round" />
          
          {/* Branches */}
          <path d="M100 140 Q70 120 50 130" strokeWidth="5" stroke="#6D4C41" fill="none" />
          <path d="M100 110 Q130 90 150 110" strokeWidth="5" stroke="#6D4C41" fill="none" />
          
          {/* Foliage Blob for Summary */}
          {hasLeaves && (
            <circle cx="50" cy="130" r="15" fill="#5eead4" opacity="0.8" />
          )}
          {isLush && (
             <>
               <circle cx="150" cy="110" r="20" fill="#2dd4bf" opacity="0.9" />
               <circle cx="100" cy="70" r="40" fill="#14b8a6" opacity="0.9" />
               <circle cx="80" cy="90" r="25" fill="#0d9488" opacity="0.8" />
             </>
          )}
          {hasFruits && (
             <circle cx="110" cy="60" r="6" fill="#fbbf24" />
          )}
          {isMaster && (
             <circle cx="90" cy="80" r="6" fill="#f59e0b" />
          )}
       </svg>
       
       <div className="mt-2 text-center w-full px-8 relative z-10">
         <h4 className="font-serif-text font-bold text-teal-900 text-lg">
           Pohon Hikmah
         </h4>
         <p className="text-teal-600/70 text-xs uppercase tracking-widest font-bold">
           {count} Daun Tumbuh
         </p>
       </div>
    </div>
  );
};

// --- Modal Detail Entry ---
const EntryModal: React.FC<{ 
  entry: any; 
  content: DailyContent | undefined;
  onClose: () => void;
  onNavigate: (day: number) => void;
}> = ({ entry, content, onClose, onNavigate }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative z-10 max-h-[80vh] flex flex-col"
      >
        {/* Header Modal */}
        <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 flex justify-between items-center">
           <div>
             <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Hari ke-{entry.day}</span>
             <h3 className="font-serif-text font-bold text-xl text-teal-900">
               {content ? `${content.surahName}` : 'Catatan Hati'}
             </h3>
           </div>
           <button 
             onClick={onClose}
             className="w-8 h-8 rounded-full bg-white text-stone-400 hover:text-rose-500 flex items-center justify-center shadow-sm transition-colors"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
           <div className="mb-6 relative">
              <div className="absolute top-0 left-0 text-6xl text-teal-100 font-serif-text -z-10 opacity-50">"</div>
              <p className="text-lg text-stone-700 font-serif-text leading-relaxed whitespace-pre-line relative z-10 pl-4 border-l-2 border-teal-200">
                {entry.notes}
              </p>
           </div>
           
           {content && (
             <div className="bg-stone-50 rounded-lg p-4 border border-stone-100 text-sm">
                <p className="font-bold text-stone-600 mb-1">Ayat Terkait:</p>
                <p className="font-arabic text-right text-teal-800 text-lg mb-2">{content.arabicText}</p>
                <p className="italic text-stone-500">"{content.translation}"</p>
             </div>
           )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
           <button 
             onClick={() => onNavigate(entry.day)}
             className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
           >
             <span>Buka Halaman Tadabbur</span>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Activity Chart Component (Recharts) ---
const ActivityChart: React.FC<{ entries: any[] }> = ({ entries }) => {
  const [range, setRange] = useState<'7' | '14'>('7');

  // Transform data for chart
  const chartData = entries.map(entry => ({
    name: `${entry.day}`,
    tadabbur: entry.track.tadabburRead ? 1 : 0,
    praktik: entry.track.practiceDone ? 1 : 0,
    doa: entry.track.duaDone ? 1 : 0,
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  // Filter based on range
  const limit = range === '7' ? 7 : 14;
  const displayData = chartData.length > limit ? chartData.slice(chartData.length - limit) : chartData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-stone-200 shadow-lg rounded-lg text-xs">
          <p className="font-bold text-teal-800 mb-1">Hari ke-{label}</p>
          <div className="space-y-1">
            <p className="text-teal-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${payload[0]?.value ? 'bg-teal-400' : 'bg-stone-200'}`}></span>
              Tadabbur: {payload[0]?.value ? 'Ya' : 'Tidak'}
            </p>
            <p className="text-emerald-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${payload[1]?.value ? 'bg-emerald-500' : 'bg-stone-200'}`}></span>
              Praktik: {payload[1]?.value ? 'Ya' : 'Tidak'}
            </p>
            <p className="text-amber-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${payload[2]?.value ? 'bg-amber-500' : 'bg-stone-200'}`}></span>
              Doa: {payload[2]?.value ? 'Ya' : 'Tidak'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-end mb-2">
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button 
            onClick={() => setRange('7')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${range === '7' ? 'bg-white shadow-sm text-teal-700' : 'text-stone-400 hover:text-stone-600'}`}
          >
            7 Hari
          </button>
          <button 
            onClick={() => setRange('14')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${range === '14' ? 'bg-white shadow-sm text-teal-700' : 'text-stone-400 hover:text-stone-600'}`}
          >
            14 Hari
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#78716c' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 1]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f4' }} />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            
            {/* Grouped Bars (Unstacked) for clear separation */}
            <Bar dataKey="tadabbur" name="Tadabbur" fill="#2dd4bf" radius={[3, 3, 0, 0]} animationDuration={1500} />
            <Bar dataKey="praktik" name="Praktik" fill="#10b981" radius={[3, 3, 0, 0]} animationDuration={1500} animationBegin={200} />
            <Bar dataKey="doa" name="Doa" fill="#f59e0b" radius={[3, 3, 0, 0]} animationDuration={1500} animationBegin={400} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-[10px] text-stone-400 mt-2 italic">
        Grafik menunjukkan penyelesaian tiap item secara terpisah
      </p>
    </div>
  );
};

// --- Interactive Tree Component ---
const InteractiveJournalTree: React.FC<{ 
  entries: any[]; 
  cachedContent: Record<number, DailyContent>;
  onEntryClick: (entry: any) => void; 
}> = ({ entries, cachedContent, onEntryClick }) => {
  const sortedEntries = [...entries].sort((a, b) => b.day - a.day); // Descending (Top to Root)
  
  const nodeHeight = 80;
  const treeHeight = Math.max(400, (sortedEntries.length + 1) * nodeHeight);
  const centerX = 160; // Center of viewBox width (320)

  // Animation Variants
  const leafVariants: Variants = {
    hidden: { scale: 0, opacity: 0, rotate: -20 },
    bud: (delay: number) => ({ 
      scale: 0.3, 
      opacity: 1, 
      rotate: 0, 
      transition: { duration: 0.6, ease: "easeOut", delay } 
    }),
    bloomed: (delay: number) => ({ 
      scale: 1, 
      rotate: 0, 
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 12,
        mass: 0.8,
        delay: delay + 0.6
      } 
    }),
    sway: {
      rotate: [0, 2, -1, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const
      }
    }
  };

  const fruitVariants: Variants = {
    hidden: { scale: 0, opacity: 0, y: -10 },
    grow: (delay: number) => ({ 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 150, 
        damping: 10,
        delay: delay + 1.2
      } 
    }),
    swing: {
      rotate: [0, 5, -5, 0],
      originY: 0,
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto my-8 select-none">
       <svg width="100%" height={treeHeight} viewBox={`0 0 320 ${treeHeight}`} className="overflow-visible">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Trunk (Central Line) */}
          <motion.path 
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 2, ease: "easeOut" }}
             d={`M${centerX} ${treeHeight} L${centerX} 40`} 
             stroke="#78350f" 
             strokeWidth="6" 
             strokeLinecap="round"
             className="opacity-80"
          />

          {/* Ground */}
          <ellipse cx={centerX} cy={treeHeight - 5} rx="80" ry="10" fill="#d6d3d1" opacity="0.5" />

          {/* Branches & Leaves */}
          <AnimatePresence>
          {sortedEntries.map((entry, index) => {
            const isLeft = index % 2 !== 0;
            const yPos = 60 + (index * nodeHeight); 
            const controlX = isLeft ? centerX - 40 : centerX + 40;
            const endX = isLeft ? centerX - 80 : centerX + 80;
            const endY = yPos - 10;
            const isFruitDay = entry.day % 5 === 0;

            const animationDelay = 0.5 + (0.15 * (sortedEntries.length - index));
            
            return (
              <g key={entry.day} onClick={() => onEntryClick(entry)} className="cursor-pointer group">
                
                {/* Branch */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: animationDelay - 0.3 }}
                  d={`M${centerX} ${yPos} Q${controlX} ${yPos} ${endX} ${endY}`}
                  stroke="#8B4513"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Leaf Group Container */}
                <motion.g
                  custom={animationDelay}
                  initial="hidden"
                  animate={["bud", "bloomed", "sway"]}
                  variants={leafVariants}
                  className="hover:scale-110 transition-transform duration-200"
                  style={{ transformBox: "fill-box", transformOrigin: "bottom center" }} // Stem anchor
                >
                    <path 
                      d={`M${endX} ${endY} 
                         C${endX + (isLeft?-30:30)} ${endY-30}, 
                           ${endX + (isLeft?-50:50)} ${endY}, 
                           ${endX} ${endY+30} 
                         C${endX + (isLeft?30:-30)} ${endY+15}, 
                           ${endX + (isLeft?10:-10)} ${endY-10}, 
                           ${endX} ${endY} Z`}
                      fill={isFruitDay ? "#fcd34d" : "#2dd4bf"} 
                      stroke="#0f766e"
                      strokeWidth="1"
                      className="drop-shadow-sm group-hover:fill-teal-400 transition-colors"
                    />
                    <path 
                      d={`M${endX} ${endY} L${endX + (isLeft?-35:35)} ${endY+5}`}
                      stroke="#0f766e" strokeWidth="0.5" opacity="0.5"
                    />
                    <circle cx={endX + (isLeft?-15:15)} cy={endY + 5} r="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
                    <text 
                      x={endX + (isLeft?-15:15)} 
                      y={endY + 9} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="bold" 
                      fill="#0f766e"
                      className="font-serif-text"
                    >
                      {entry.day}
                    </text>
                </motion.g>

                {/* Fruit (if applicable) - Hanging Physics */}
                {isFruitDay && (
                  <motion.g
                    custom={animationDelay}
                    initial="hidden"
                    animate={["grow", "swing"]}
                    variants={fruitVariants}
                    style={{ transformBox: "fill-box", transformOrigin: "top center" }}
                  >
                     <line x1={endX + (isLeft?-25:25)} y1={endY+15} x2={endX + (isLeft?-25:25)} y2={endY+25} stroke="#78350f" strokeWidth="1" />
                     <circle 
                        cx={endX + (isLeft?-25:25)} 
                        cy={endY+28} 
                        r="5" 
                        fill="#f59e0b" 
                        stroke="#b45309"
                        className="drop-shadow-md"
                     />
                  </motion.g>
                )}
                
                <circle cx={endX + (isLeft?-20:20)} cy={endY} r="30" fill="transparent" />
              </g>
            );
          })}
          </AnimatePresence>
       </svg>
    </div>
  );
};

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
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Calculate statistics
  const { readCount, practiceCount, duaCount } = (Object.values(tracker) as DailyTrack[]).reduce(
    (acc, t) => ({
      readCount: acc.readCount + (t.tadabburRead ? 1 : 0),
      practiceCount: acc.practiceCount + (t.practiceDone ? 1 : 0),
      duaCount: acc.duaCount + (t.duaDone ? 1 : 0),
    }),
    { readCount: 0, practiceCount: 0, duaCount: 0 }
  );

  // Filter entries
  const entries = Object.entries(tracker)
    .map(([dayStr, track]) => {
      const t = track as DailyTrack;
      return {
        day: parseInt(dayStr),
        notes: t.notes,
        track: t
      };
    })
    .filter(entry => entry.notes && entry.notes.trim().length > 0)
    .sort((a, b) => a.day - b.day);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <AnimatePresence>
        {selectedEntry && (
          <EntryModal 
            entry={selectedEntry} 
            content={cachedContent[selectedEntry.day]}
            onClose={() => setSelectedEntry(null)}
            onNavigate={(day) => {
              setSelectedEntry(null);
              onNavigateToDay(day);
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-serif-text font-bold text-teal-900">Jurnal Tadabbur</h2>
          <p className="text-stone-500 text-sm">Pohon amalan dari jejak pikiran Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
         <div className="text-center">
            <div className="text-xl">👀</div>
            <div className="text-xs font-bold text-stone-500">Tadabbur</div>
            <div className="text-lg font-bold text-teal-700">{readCount}</div>
         </div>
         <div className="text-center border-l border-stone-100">
            <div className="text-xl">🤲</div>
            <div className="text-xs font-bold text-stone-500">Praktik</div>
            <div className="text-lg font-bold text-emerald-700">{practiceCount}</div>
         </div>
         <div className="text-center border-l border-stone-100">
            <div className="text-xl">📿</div>
            <div className="text-xs font-bold text-stone-500">Doa</div>
            <div className="text-lg font-bold text-amber-700">{duaCount}</div>
         </div>
      </div>

      <SummaryTree count={entries.length} />

      <div className="mb-12">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-4">
           <h3 className="text-teal-800 font-bold font-serif-text text-xl">
               Riwayat Pohon Hati
           </h3>
           <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-md border border-teal-100">
             Klik daun untuk detail
           </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
             <p className="text-stone-400 text-sm animate-pulse">Menumbuhkan pohon...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 shadow-sm mx-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-5xl mb-4 opacity-30 grayscale animate-pulse">🌱</div>
            <h3 className="text-lg font-bold text-stone-700 mb-2 font-serif-text">Bibit Belum Tumbuh</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
              Mulai isi "Catatan Hati" pada sesi harianmu untuk menumbuhkan daun pertamamu.
            </p>
            <button 
              onClick={onBack} 
              className="px-6 py-2 bg-teal-700 text-white rounded-full font-medium hover:bg-teal-800 transition-colors shadow-lg text-sm"
            >
              Mulai Menulis
            </button>
          </div>
        ) : (
          <>
            <InteractiveJournalTree 
              entries={entries} 
              cachedContent={cachedContent}
              onEntryClick={setSelectedEntry} 
            />
            
            <div className="mt-8 border-t border-stone-100 pt-6">
              <button 
                onClick={() => setShowChart(!showChart)}
                className="flex items-center justify-between w-full p-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors group"
              >
                <span className="font-bold text-stone-700 flex items-center gap-2">
                   <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   Analisis Frekuensi Amalan
                </span>
                <svg 
                  className={`w-5 h-5 text-stone-400 transform transition-transform duration-300 ${showChart ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {showChart && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-2">
                      <ActivityChart entries={entries} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <div className="bg-stone-100 rounded-xl p-6 border border-stone-200 mt-12 opacity-80 hover:opacity-100 transition-opacity">
        <h3 className="font-serif-text font-bold text-stone-700 mb-4 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          Backup & Restore Data
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onExportData}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors text-xs font-medium shadow-sm"
          >
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
              className="w-full h-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors text-xs font-medium shadow-sm"
            >
              Restore File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};