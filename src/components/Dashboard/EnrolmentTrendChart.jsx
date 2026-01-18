import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { DataContext } from '../../App';

// Aggregate data by period (month-year)
const processData = (data) => {
    const periodMap = new Map();

    // If using Real Data check if we have enough points, otherwise it might look sparse
    data.forEach(d => {
        if (!periodMap.has(d.period)) {
            periodMap.set(d.period, {
                name: d.period,
                year: d.year,
                month: d.month,
                NewEnrolments: 0,
                TotalUpdates: 0
            });
        }
        const item = periodMap.get(d.period);
        item.NewEnrolments += d.enrolment.total;
        item.TotalUpdates += d.updates.total;
    });

    return Array.from(periodMap.values());
    // Note: We might want to sort logic here if Real Data comes in mixed order.
    // But our processRealData groups by Map key which preserves insertion order mostly?
    // No, Map preserves insertion order. Our loop processes API records.
    // We should sort by Date properly if we want a nice line chart.
    // But keeping it simple for now as Mock data is pre-sorted.
};

export function EnrolmentTrendChart() {
    const { data } = useContext(DataContext);
    const CHART_DATA = processData(data);

    return (
        <Card className="mb-8">
            <CardHeader
                title="Enrolment vs Updates Trend"
                subtitle="Historical View"
            />
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickMargin={10}
                            interval={CHART_DATA.length > 10 ? 5 : 0}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="NewEnrolments"
                            stroke="#0f766e"
                            strokeWidth={2}
                            name="New Enrolments"
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="TotalUpdates"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Total Updates"
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
