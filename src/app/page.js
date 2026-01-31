'use client';

import { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import SentencingCard from '@/components/SentencingCard';
import { Scale } from 'lucide-react';

export default function Home() {
  const [selectedCrime, setSelectedCrime] = useState(null);

  return (
    <main className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <div className="bg-[#0B1120] text-white pt-12 pb-16 border-b-4 border-[#C5A067]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-[#1a2336] border border-[#C5A067]/30 shadow-2xl">
              <Scale className="w-12 h-12 text-[#C5A067]" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-serif tracking-tight leading-tight">
            Georgia Sentencing Guide
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            The authoritative resource for O.C.G.A. criminal penalties.
            <span className="block mt-2 text-[#C5A067] font-serif italic text-lg">
              Investigate. Mitigate. Advocate.
            </span>
          </p>

          <div className="pt-4">
            <SearchInput onSelect={setSelectedCrime} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-slate-50 relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0B1120_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-4xl mx-auto px-4 py-4 relative z-10">
          {!selectedCrime && (
            <div className="text-center py-8 text-slate-400 space-y-4">
              <p className="uppercase tracking-widest text-xs font-semibold text-slate-500">Select an offense to begin</p>
              <div className="w-16 h-px bg-slate-300 mx-auto"></div>
            </div>
          )}
          <SentencingCard crime={selectedCrime} />
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm font-light">
        <p className="mb-2 text-[#0B1120] font-serif font-semibold tracking-wide">Published by Swingle Levin, LLC</p>
        <p>&copy; {new Date().getFullYear()} Georgia Sentencing Guide. For informational purposes only.</p>
      </footer>
    </main>
  );
}
