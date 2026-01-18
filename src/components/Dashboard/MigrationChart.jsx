import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { aggregateData } from '../../data/api';
import { DataContext } from '../../context/DataContext';

export function MigrationChart() {
    const { data: rawData } = useContext(DataContext);

    const data = aggregateData(rawData)
        .sort((a, b) => b.totalAddressUpdates - a.totalAddressUpdates)
        .slice(0, 10); // Top 10 migration hubs

    return (
        <Card className="mb-8">
            <CardHeader
                title="Migration Patterns"
                subtitle="Top States by Address Update Intensity"
            />
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="state"
                            width={100}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    const ratio = d.totalEnrolment > 0 ? (d.totalAddressUpdates / d.totalEnrolment).toFixed(2) : 0;
                                    return (
                                        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                                            <p className="font-bold text-slate-800">{d.state}</p>
                                            <p className="text-sm text-slate-600">Address Updates: {d.totalAddressUpdates.toLocaleString()}</p>
                                            <p className="text-sm text-slate-500">Intensity Ratio: {ratio}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="totalAddressUpdates" name="Inward Migration Intensity" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index < 3 ? '#ef4444' : '#3b82f6'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
