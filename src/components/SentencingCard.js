'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CarFront, Info, Scale } from 'lucide-react';
import { buildPenaltySummary, calculatePenalty, formatDuration } from '@/utils/sentencing';

function money(value) {
    if (value === null || value === undefined) return 'Not stated';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function ParoleDetails({ summary }) {
    if (summary.paroleStatus === 'not-applicable') {
        return <p>State parole guidelines do not apply to misdemeanor jail sentences.</p>;
    }

    if (summary.paroleStatus !== 'grid') {
        return (
            <div className="space-y-2">
                <p className="font-semibold text-[#0B1120]">
                    {summary.paroleStatus === 'statutory-no-parole'
                        ? 'The parole grid does not control this sentence.'
                        : 'No numeric CSL is assigned in the public parole chart.'}
                </p>
                {summary.paroleNote && <p>{summary.paroleNote}</p>}
            </div>
        );
    }

    const grid = summary.paroleGrid;
    if (!summary.csl || !grid) {
        return <p>The public chart does not assign this tier a numeric crime severity level. The Board may rate it by the most similar listed offense.</p>;
    }

    if (grid.kind === 'percent') {
        return (
            <div className="space-y-3">
                <p className="text-2xl font-serif font-bold text-[#0B1120]">CSL {summary.csl}: 65%–90% of the prison term</p>
                {summary.csl_provisional && <p className="font-semibold text-amber-800">Provisional CSL mapping — Parole Board confirmation is required.</p>}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-white border p-3"><strong>Low risk</strong><br />65%</div>
                    <div className="bg-white border p-3"><strong>Medium</strong><br />75%</div>
                    <div className="bg-white border p-3"><strong>High risk</strong><br />90%</div>
                </div>
                <p className="text-xs text-slate-500">A guideline recommendation is not a guaranteed release date.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-2xl font-serif font-bold text-[#0B1120]">CSL {summary.csl}: {grid.overall[0]}–{grid.overall[1]} months</p>
            {summary.csl_provisional && <p className="font-semibold text-amber-800">Provisional CSL mapping — Parole Board confirmation is required.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm">
                {Object.entries(grid.riskBands).map(([risk, range]) => (
                    <div className="bg-white border p-3" key={risk}>
                        <strong className="capitalize">{risk} risk</strong><br />{range[0]}–{range[1]} months
                    </div>
                ))}
            </div>
            {summary.csl >= 5 && <p className="text-xs text-slate-500">For CSL V–VII, the recommendation is generally the greater of one-third of the imposed prison sentence or the grid value.</p>}
            <p className="text-xs text-slate-500">A guideline recommendation is not a guaranteed release date.</p>
        </div>
    );
}

export default function SentencingCard({ crime }) {
    const [inputs, setInputs] = useState({});

    const calculation = useMemo(() => calculatePenalty(crime, inputs), [crime, inputs]);
    const summary = useMemo(() => buildPenaltySummary(crime, calculation.penalty), [crime, calculation.penalty]);

    if (!crime) return null;

    return (
        <div className="bg-white shadow-xl border-t-4 border-[#C5A067] mt-6 animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold text-[#0B1120]">{crime.title}</h2>
                        <span className="font-semibold text-slate-500 tracking-wide uppercase border-b border-[#C5A067] pb-0.5 text-sm">{crime.statute}</span>
                    </div>
                    <span className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider ${crime.type.toLowerCase().includes('felony') ? 'bg-[#0B1120] text-white' : 'bg-slate-100 text-slate-700'}`}>{crime.type}</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <p className="text-slate-700 text-lg leading-loose font-light">{crime.description}</p>

                {crime.variables?.length > 0 && (
                    <div className="bg-slate-50 p-5 border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
                            <Scale className="w-5 h-5 text-[#C5A067]" />
                            <h3 className="font-serif text-xl text-[#0B1120]">Sentencing Factors</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {crime.variables.map((variable) => (
                                <div key={variable.id}>
                                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                        {variable.label} {variable.unit && <span className="text-slate-500 font-normal normal-case">({variable.unit})</span>}
                                    </label>
                                    {variable.type === 'select' ? (
                                        <select
                                            className="block w-full px-4 py-3 border border-slate-300 bg-white text-slate-900"
                                            value={inputs[variable.id] || ''}
                                            onChange={(event) => setInputs((old) => ({ ...old, [variable.id]: event.target.value }))}
                                        >
                                            <option value="">Select an option</option>
                                            {variable.options.map((option) => <option key={option.label}>{option.label}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type="number"
                                            min={variable.input_min ?? 0}
                                            step={variable.step ?? 'any'}
                                            className="block w-full border border-slate-300 text-slate-900 p-3"
                                            placeholder="Enter an amount"
                                            value={inputs[variable.id] || ''}
                                            onChange={(event) => setInputs((old) => ({ ...old, [variable.id]: event.target.value }))}
                                        />
                                    )}
                                    {variable.help && <p className="text-xs text-slate-500 mt-2">{variable.help}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {calculation.status === 'incomplete' && <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-900">Select every sentencing factor to see the applicable range.</div>}
                {['invalid', 'no-match'].includes(calculation.status) && <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900">That value does not match a listed statutory tier. Check the amount and offense definition.</div>}

                {summary && (
                    <div className="space-y-5">
                        <div className="bg-[#fbf6ec] border border-[#e8dcc5] p-5">
                            <p className="text-[#C5A067] font-bold text-xs uppercase tracking-widest mb-2">Statutory summary</p>
                            <p className="text-[#0B1120] text-2xl font-serif font-bold">{summary.sentence}</p>
                            <p className="text-slate-600 mt-2">Classification: <strong>{summary.classification || 'See statute'}</strong></p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200">
                            {[
                                ['Minimum authorized confinement', formatDuration(summary.sentenceRange?.minimum)],
                                ['Maximum authorized confinement', formatDuration(summary.sentenceRange?.maximum)],
                                ['Minimum fine', money(summary.fineRange?.minimum)],
                                ['Maximum fine', money(summary.fineRange?.maximum)],
                            ].map(([label, value]) => (
                                <div className="p-5 border-b lg:border-b-0 lg:border-r last:border-r-0 border-slate-200" key={label}>
                                    <h4 className="text-[#C5A067] font-bold text-xs uppercase tracking-widest mb-3">{label}</h4>
                                    <p className="text-[#0B1120] text-xl font-serif font-bold">{value}</p>
                                </div>
                            ))}
                        </div>

                        {summary.must_serve && (
                            <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-6 flex gap-3">
                                <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-[#92400E] uppercase tracking-wider text-sm">Mandatory or actual-custody minimum</h4>
                                    <p className="text-[#78350F] font-semibold text-lg mt-2">{summary.must_serve}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 border border-slate-200 p-5 text-slate-700">
                            <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-[#C5A067]" /><h4 className="font-serif font-bold text-lg text-[#0B1120]">Parole guideline</h4></div>
                            <ParoleDetails summary={summary} />
                        </div>

                        {summary.other && <div className="pl-4 border-l-2 border-[#C5A067] text-slate-700"><strong>Other requirements:</strong> {summary.other}</div>}
                        {summary.notes && <p className="text-slate-500 text-sm">{summary.notes}</p>}
                    </div>
                )}

                {crime.driving_restrictions && (
                    <div className="bg-blue-50 border border-blue-200 p-5 text-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                            <CarFront className="w-5 h-5 text-blue-700" />
                            <h4 className="font-serif font-bold text-lg text-[#0B1120]">Driving and license restrictions</h4>
                        </div>
                        <p className="leading-relaxed">{crime.driving_restrictions.summary}</p>
                        <div className="mt-4 divide-y divide-blue-200 border-y border-blue-200">
                            {crime.driving_restrictions.items.map((item) => (
                                <div className="py-3" key={item.label}>
                                    <p className="font-semibold text-[#0B1120]">{item.label}</p>
                                    <p className="mt-1 text-sm leading-relaxed">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                        {crime.driving_restrictions.note && (
                            <p className="mt-4 text-xs leading-relaxed text-slate-600">
                                <strong>Important:</strong> {crime.driving_restrictions.note}
                            </p>
                        )}
                    </div>
                )}

                {crime.recidivist_info && (
                    <div className="pt-6 border-t border-slate-200">
                        <h4 className="font-serif font-bold text-lg mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#C5A067]" />Recidivist provisions</h4>
                        <p className="text-slate-600">{crime.recidivist_info}</p>
                    </div>
                )}

                {crime.sources?.length > 0 && (
                    <div className="pt-6 border-t border-slate-200">
                        <h4 className="font-serif font-bold text-lg mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#C5A067]" />Sources checked</h4>
                        <ul className="space-y-2 text-sm">
                            {crime.sources.map((source) => <li key={source.url}><a className="text-blue-700 underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}
                        </ul>
                        <p className="text-xs text-slate-500 mt-3">Reviewed {crime.reviewed_on || 'August 2, 2026'}. Later legislation or case law may change the result.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
