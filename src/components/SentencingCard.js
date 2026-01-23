'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, Gavel, Scale } from 'lucide-react';

export default function SentencingCard({ crime }) {
    const [inputs, setInputs] = useState({});
    const [calculatedSentence, setCalculatedSentence] = useState(null);

    // Reset inputs when crime changes
    useEffect(() => {
        setInputs({});
        setCalculatedSentence(null);
    }, [crime]);

    // Logic to recalculate sentence when inputs change
    useEffect(() => {
        if (!crime) return;

        if (!crime.variables || crime.variables.length === 0) {
            setCalculatedSentence(crime.base_penalty);
            return;
        }

        // Default to base penalty if variables exist but aren't fully selected
        let result = { ...crime.base_penalty };

        // Process variables
        crime.variables.forEach(variable => {
            const val = inputs[variable.id];
            if (val === undefined || val === '') return;

            if (variable.type === 'number' || variable.type === 'currency') {
                const numVal = parseFloat(val);
                const match = variable.ranges.find(r => {
                    const minOk = r.min === undefined || numVal >= r.min;
                    const maxOk = r.max === null || r.max === undefined || numVal < r.max;
                    return minOk && maxOk;
                });

                if (match) {
                    result = { ...result, ...match };
                }
            } else if (variable.type === 'select') {
                const match = variable.options.find(opt => opt.label === val);
                if (match) {
                    result = { ...result, ...match };
                }
            }
        });

        setCalculatedSentence(result);

    }, [crime, inputs]);

    if (!crime) return null;

    return (
        <div className="bg-white shadow-xl border-t-4 border-[#C5A067] mt-12 animate-fade-in-up">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold text-[#0B1120]">{crime.title}</h2>
                        <div className="flex items-center gap-4 text-sm mt-2">
                            <span className="font-semibold text-slate-500 tracking-wide uppercase border-b border-[#C5A067] pb-0.5">
                                {crime.statute}
                            </span>
                            {crime.type.toLowerCase().includes('felony') && (
                                <span className="text-[#0B1120] font-bold uppercase tracking-widest text-xs px-2 py-0.5 bg-slate-100 ml-2">
                                    Felony
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider ${crime.type.toLowerCase().includes('felony')
                        ? 'bg-[#0B1120] text-white'
                        : 'bg-slate-100 text-slate-700'
                        }`}>
                        {crime.type}
                    </span>
                </div>
            </div>

            <div className="p-8 space-y-10">
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 text-lg leading-loose font-light">
                        {crime.description}
                    </p>
                </div>

                {/* Variables Inputs */}
                {crime.variables && crime.variables.length > 0 && (
                    <div className="bg-slate-50 p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
                            <Scale className="w-5 h-5 text-[#C5A067]" />
                            <h3 className="font-serif text-xl text-[#0B1120]">Sentencing Factors</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {crime.variables.map(variable => (
                                <div key={variable.id}>
                                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                        {variable.label} {variable.unit && <span className="text-slate-500 font-normal normal-case">({variable.unit})</span>}
                                    </label>
                                    {variable.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                className="block w-full pl-4 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#C5A067] focus:border-[#C5A067] bg-white text-slate-900 rounded-none shadow-sm"
                                                value={inputs[variable.id] || ''}
                                                onChange={(e) => setInputs(prev => ({ ...prev, [variable.id]: e.target.value }))}
                                            >
                                                <option value="">Select Option</option>
                                                {variable.options.map(opt => (
                                                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#C5A067]">
                                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type={variable.type === 'number' || variable.type === 'currency' ? 'number' : 'text'}
                                            className="block w-full border-slate-300 focus:ring-1 focus:ring-[#C5A067] focus:border-[#C5A067] text-slate-900 p-3 rounded-none shadow-sm"
                                            placeholder="—"
                                            value={inputs[variable.id] || ''}
                                            onChange={(e) => setInputs(prev => ({ ...prev, [variable.id]: e.target.value }))}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {calculatedSentence && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200">
                            {/* Sentence Card */}
                            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-[#fbf6ec]">
                                <h4 className="text-[#C5A067] font-bold text-xs uppercase tracking-widest mb-4">
                                    Confinement
                                </h4>
                                <p className="text-[#0B1120] text-3xl font-serif font-bold">
                                    {calculatedSentence.sentence || "Varies by discretion"}
                                </p>
                                {calculatedSentence.mandatory_minimum && (
                                    <div className="mt-4 inline-block px-3 py-1 bg-[#0B1120] text-white text-xs font-bold uppercase tracking-wider">
                                        Mandatory Minimum: {calculatedSentence.mandatory_minimum} years
                                    </div>
                                )}
                            </div>

                            {/* Fine Card */}
                            <div className="p-8 bg-white">
                                <h4 className="text-[#C5A067] font-bold text-xs uppercase tracking-widest mb-4">
                                    Financial Penalty
                                </h4>
                                <p className="text-[#0B1120] text-3xl font-serif font-bold">
                                    {calculatedSentence.fine
                                        ? (typeof calculatedSentence.fine === 'number'
                                            ? `$${calculatedSentence.fine.toLocaleString()}`
                                            : calculatedSentence.fine)
                                        : "Discretionary"}
                                </p>
                                <p className="text-slate-400 text-xs mt-2 italic">
                                    *Plus statutory surcharges
                                </p>
                            </div>
                        </div>

                        {calculatedSentence.severity_level && (
                            <div className="flex items-center gap-4 text-[#0B1120]">
                                <Info className="w-5 h-5 text-[#C5A067]" />
                                <span className="uppercase tracking-widest text-sm font-bold">Classification: {calculatedSentence.severity_level}</span>
                            </div>
                        )}

                        {calculatedSentence.other && (
                            <div className="pl-4 border-l-2 border-[#C5A067] text-slate-700 italic">
                                <span className="font-bold not-italic text-[#0B1120]">Requirements:</span> {calculatedSentence.other}
                            </div>
                        )}
                        {calculatedSentence.notes && (
                            <div className="text-slate-500 text-xs">
                                * {calculatedSentence.notes}
                            </div>
                        )}
                    </div>
                )}

                {/* Recidivism Info */}
                {crime.recidivist_info && (
                    <div className="pt-8 border-t border-slate-200">
                        <h4 className="text-[#0B1120] font-serif font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[#C5A067]" />
                            Recidivist Provisions
                        </h4>
                        <div className="text-slate-600 leading-relaxed">
                            {crime.recidivist_info}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
