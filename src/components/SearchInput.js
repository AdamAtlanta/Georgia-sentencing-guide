'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchCrimes } from '@/utils/search';

export default function SearchInput({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (query.length > 0) {
            const hits = searchCrimes(query);
            setResults(hits);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query]);

    const handleSelect = (crime) => {
        setQuery(crime.title);
        setIsOpen(false);
        onSelect(crime);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#0B1120]" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-5 border-0 rounded-none bg-white text-[#0B1120] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A067] text-lg shadow-xl"
                    placeholder="Search by crime or O.C.G.A. statute..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white shadow-2xl max-h-80 overflow-auto border-t-2 border-[#C5A067]">
                    {results.map((crime) => (
                        <li
                            key={crime.id}
                            className="cursor-pointer select-none relative py-4 pl-6 pr-4 hover:bg-[#fbf6ec] hover:pl-8 transition-all duration-200 border-b border-slate-100 last:border-0 group"
                            onClick={() => handleSelect(crime)}
                        >
                            <div className="flex flex-row items-baseline gap-2">
                                <span className="font-serif font-bold text-[#0B1120] text-lg group-hover:text-[#C5A067] transition-colors">
                                    {crime.title}
                                </span>
                                <span className="text-slate-400 text-xs tracking-wider uppercase whitespace-nowrap">
                                    {/* Explicit space added before O.C.G.A. */}
                                    &nbsp;&nbsp;{crime.statute}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
