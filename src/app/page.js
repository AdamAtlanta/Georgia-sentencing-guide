'use client';

import { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import SentencingCard from '@/components/SentencingCard';
import { Scale } from 'lucide-react';

export default function Home() {
  const [selectedCrime, setSelectedCrime] = useState(null);

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <aside
        aria-labelledby="legal-disclaimer-title"
        className="border-b border-amber-300 bg-amber-50 text-[#0B1120]"
        role="note"
      >
        <div className="mx-auto max-w-5xl px-4 py-4 sm:py-5">
          <p className="text-sm leading-6 sm:text-base sm:leading-7">
            <strong id="legal-disclaimer-title" className="font-bold">
              This does not provide legal advice.
            </strong>{' '}
            Your use of this webpage does not create an attorney client relationship
            between the user of this webpage and any attorney at Swingle Levin, LLC.
            The results may contain errors or incomplete information and you should
            still consult with an attorney before relying on this information. If you
            find errors, please contact{' '}
            <a
              className="font-semibold text-blue-800 underline decoration-blue-800/50 underline-offset-2 hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-amber-50"
              href="mailto:Adam@SwingleLevin.com?subject=Georgia%20Sentencing%20Guide%20Correction"
            >
              Adam@SwingleLevin.com
            </a>
            .
          </p>
        </div>
      </aside>

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
            A plain-language reference for Georgia criminal penalties and parole guidelines.
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
          <SentencingCard key={selectedCrime?.id || 'none'} crime={selectedCrime} />
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm font-light">
        <p className="mb-2 text-[#0B1120] font-serif font-semibold tracking-wide">Published by Swingle Levin, LLC</p>
        <p>&copy; {new Date().getFullYear()} Georgia Sentencing Guide. Informational only—not legal advice. Verify current law for every case.</p>
      </footer>
    </main>
  );
}
