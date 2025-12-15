import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-teal-950 text-stone-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px]"></div>
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 max-w-md mx-auto w-full text-center">
        
        {/* Animated Icon / Logo Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="w-32 h-32 rounded-full border border-teal-800/50 flex items-center justify-center bg-gradient-to-br from-teal-900 to-teal-950 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
             
             {/* Tree Icon */}
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
               <path d="M12 22V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               <path d="M12 11L7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               <path d="M12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               <circle cx="7" cy="6" r="3" fill="#2dd4bf" fillOpacity="0.8" />
               <circle cx="17" cy="6" r="3" fill="#2dd4bf" fillOpacity="0.8" />
               <circle cx="12" cy="4" r="3" fill="#fbbf24" />
             </svg>
          </div>
          {/* Orbiting particles */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full rounded-full border border-dashed border-teal-700/30"
          ></motion.div>
        </motion.div>

        {/* Typography */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-teal-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Aplikasi Jurnal Tadabbur</h2>
          <h1 className="font-serif-text text-4xl md:text-5xl font-bold text-stone-50 leading-tight mb-2">
            99 Hari <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Menyentuh Hati</span>
          </h1>
          <p className="font-arabic text-xl text-teal-300/80 mt-2 mb-6 dir-rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="h-1 bg-teal-800 rounded-full mb-8"
        ></motion.div>

        {/* Value Props */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="grid grid-cols-1 gap-4 text-left w-full mb-12"
        >
           <div className="flex items-center gap-4 bg-teal-900/30 p-4 rounded-xl border border-teal-800/30 backdrop-blur-sm">
             <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-xl shadow-lg">🌱</div>
             <div>
               <h3 className="font-bold text-stone-200 text-sm">Tumbuhkan Pohon Iman</h3>
               <p className="text-xs text-teal-300/70">Visualisasikan progres amalanmu menjadi pohon yang rindang.</p>
             </div>
           </div>
           
           <div className="flex items-center gap-4 bg-teal-900/30 p-4 rounded-xl border border-teal-800/30 backdrop-blur-sm">
             <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-xl shadow-lg">📖</div>
             <div>
               <h3 className="font-bold text-stone-200 text-sm">Tadabbur Juz Amma</h3>
               <p className="text-xs text-teal-300/70">Hikmah mendalam, hadis, dan panduan praktik harian.</p>
             </div>
           </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-teal-950 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)] relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            MULAI PERJALANAN
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </motion.button>
        
        <p className="mt-4 text-[10px] text-teal-600 uppercase tracking-widest opacity-60">Gratis & Tanpa Iklan</p>

      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-teal-900 via-amber-500 to-teal-900"></div>
    </div>
  );
};