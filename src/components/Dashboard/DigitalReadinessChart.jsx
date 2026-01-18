import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { aggregateData } from '../../data/api';
import { DataContext } from '../../context/DataContext';

export function DigitalReadinessChart() {
    const { data: rawData } = useContext(DataContext);

    const data = aggregateData(rawData)
        .sort((a, b) => b.totalUpdates - a.totalUpdates)
        .slice(0, 10); // Top 10 by volume

    return (
        <Card className="mb-8">
            <CardHeader
                title="Digital Readiness"
                subtitle="Update Type Breakdown (Dark Zones Analysis)"
            />
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="state" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalMobileUpdates" name="Mobile" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="totalAddressUpdates" name="Address" stackId="a" fill="#10b981" />
                        <Bar dataKey="totalBioUpdates" name="Biometric (In-Center)" stackId="a" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
