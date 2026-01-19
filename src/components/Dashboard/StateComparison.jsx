import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Card } from '../UI/Card';
import { STATE_LIST, aggregateData } from '../../data/api';
import { ArrowRightLeft, TrendingUp, Users, Fingerprint } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function StateComparison({ onClose }) {
    const { data } = useContext(DataContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stateA, setStateA] = useState(STATE_LIST[0] || '');
    const [stateB, setStateB] = useState(STATE_LIST[1] || '');

    // Helper to get stats for a state
    const getStats = (stateName) => {
        const stateData = data.filter(d => d.state === stateName);
        const agg = aggregateData(stateData);
        // Calculate derived metrics
        const totalEnrol = agg.totalEnrolment || 0;
        const totalUpdate = agg.totalUpdates || 0;
        const bioUpdates = agg.totalBiometricUpdates || 0;

        const mbuCompliance = totalEnrol > 0 ? (bioUpdates / totalEnrol) * 100 : 0;
        const saturation = totalEnrol > 0 ? (totalUpdate / totalEnrol) * 100 : 0;

        return {
            name: stateName,
            enrolment: totalEnrol,
            updates: totalUpdate,
            compliance: mbuCompliance,
            saturation: saturation
        };
    };

    const statsA = getStats(stateA);
    const statsB = getStats(stateB);

    const chartData = [
        { name: 'MBU Compliance %', [stateA]: statsA.compliance, [stateB]: statsB.compliance },
        { name: 'Update Saturation %', [stateA]: statsA.saturation, [stateB]: statsB.saturation },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 mb-8">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800 dark:text-white">State Comparison Engine</h3>
                </div>
                <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
                    Close Comparison
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls & Metrics */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* State A Column */}
                    <div className="space-y-4">
                        <select
                            value={stateA}
                            onChange={(e) => setStateA(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {STATE_LIST.sort().map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-indigo-300 uppercase font-semibold">Total Enrolments</p>
                                <p className="text-3xl font-bold text-indigo-900 dark:text-white">{statsA.enrolment.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-indigo-300 uppercase font-semibold">Updates Processed</p>
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{statsA.updates.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center border-4 border-slate-50 dark:border-slate-900 shadow-lg z-10">
                        <span className="font-bold text-slate-400 text-xs">VS</span>
                    </div>

                    {/* State B Column */}
                    <div className="space-y-4">
                        <select
                            value={stateB}
                            onChange={(e) => setStateB(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-lg outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            {STATE_LIST.sort().map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-xl border border-violet-100 dark:border-violet-800 space-y-4">
                            <div className="text-right">
                                <p className="text-sm text-slate-500 dark:text-violet-300 uppercase font-semibold">Total Enrolments</p>
                                <p className="text-3xl font-bold text-violet-900 dark:text-white">{statsB.enrolment.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 dark:text-violet-300 uppercase font-semibold">Updates Processed</p>
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{statsB.updates.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparative Chart */}
                <div className="lg:col-span-3">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Performance Metrics Comparison
                    </h4>
                    <div className="h-[300px] w-full border border-slate-100 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDark ? "#cbd5e1" : "#64748b" }} />
                                <YAxis tick={{ fontSize: 12, fill: isDark ? "#cbd5e1" : "#64748b" }} />
                                <Tooltip
                                    cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                                    contentStyle={{
                                        backgroundColor: isDark ? '#0f172a' : '#fff',
                                        borderColor: isDark ? '#1e293b' : '#e2e8f0',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey={stateA} fill="#6366f1" name={stateA} radius={[4, 4, 0, 0]} />
                                <Bar dataKey={stateB} fill="#8b5cf6" name={stateB} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
