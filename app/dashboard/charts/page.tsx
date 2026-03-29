"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import {
    BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { format, subDays, subMonths, isAfter } from "date-fns";
import { BarChart3, Clock, PieChart as PieChartIcon } from "lucide-react";

type TimeRange = '7D' | '1M' | '6M' | '1Y' | 'ALL';

const COLORS = ['#f97316', '#0ea5e9', '#22c55e', '#a855f7', '#ec4899', '#eab308'];

export default function ChartsPage() {
    const { transactions } = useDashboard();
    const [timeRange, setRange] = useState<TimeRange>('1M');

    // Filter transactions by selected time range
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const cutoff =
            timeRange === '7D' ? subDays(now, 7) :
                timeRange === '1M' ? subMonths(now, 1) :
                    timeRange === '6M' ? subMonths(now, 6) :
                        timeRange === '1Y' ? subMonths(now, 12) : new Date(0); // ALL

        return transactions.filter(t => isAfter(t.date, cutoff));
    }, [transactions, timeRange]);

    // Data for Bar/Line Chart
    const timeSeriesData = useMemo(() => {
        const grouped: Record<string, { date: string, timestamp: number, debit: number, credit: number }> = {};

        filteredTransactions.forEach(t => {
            const dateStr = format(t.date, 'MMM dd');
            if (!grouped[dateStr]) {
                grouped[dateStr] = { date: dateStr, timestamp: t.date.getTime(), debit: 0, credit: 0 };
            }
            if (t.type === 'debit') grouped[dateStr].debit += t.amount;
            else grouped[dateStr].credit += t.amount;
        });

        const data = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);

        if (data.length === 0) {
            data.push({ date: format(new Date(), 'MMM dd'), timestamp: Date.now(), debit: 0, credit: 0 });
        }
        return data;
    }, [filteredTransactions]);

    // Data for Pie Chart
    const categoryData = useMemo(() => {
        const grouped: Record<string, number> = {};
        filteredTransactions.forEach(t => {
            grouped[t.category] = (grouped[t.category] || 0) + t.amount;
        });

        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by largest volume
    }, [filteredTransactions]);

    const totalDebitForPeriod = filteredTransactions.reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc, 0);
    const totalCreditForPeriod = filteredTransactions.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc, 0);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-sky-500" /> Deep Analytics
                    </h1>
                    <p className="text-zinc-400">Advanced cashflow and categorization visualizations.</p>
                </div>

                {/* Time Range Filter */}
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-zinc-400 ml-2" />
                    {(['7D', '1M', '6M', '1Y', 'ALL'] as TimeRange[]).map(range => (
                        <button
                            key={range}
                            onClick={() => setRange(range)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </header>

            {/* Quick Summary row for the selected period */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-zinc-500 uppercase">Period Debits</div>
                    <div className="text-xl font-bold text-red-500">₹{totalDebitForPeriod.toFixed(2)}</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-zinc-500 uppercase">Period Credits</div>
                    <div className="text-xl font-bold text-green-500">₹{totalCreditForPeriod.toFixed(2)}</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-zinc-500 uppercase">Net Diff</div>
                    <div className={`text-xl font-bold ${totalCreditForPeriod >= totalDebitForPeriod ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{Math.abs(totalCreditForPeriod - totalDebitForPeriod).toFixed(2)}
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-zinc-500 uppercase">Transactions</div>
                    <div className="text-xl font-bold text-white">{filteredTransactions.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Line & Bar Charts */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Comparative Line Chart */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl h-[400px] flex flex-col hover:border-sky-500/30 transition-colors duration-500">
                        <h2 className="text-xl font-bold text-white mb-6">Debit vs Credit (Trend)</h2>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(value) => `₹${value}`} tickLine={false} axisLine={false} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }} />
                                    <Legend iconType="circle" />
                                    <Line type="monotone" dataKey="debit" name="Debit" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} />
                                    <Line type="monotone" dataKey="credit" name="Credit" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#22c55e' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl h-[400px] flex flex-col hover:border-sky-500/30 transition-colors duration-500">
                        <h2 className="text-xl font-bold text-white mb-6">Gross Volume per Day</h2>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={timeSeriesData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(value) => `₹${value}`} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }} />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="debit" name="Debit" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="credit" name="Credit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right Column: Pie Chart and extra data */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Category Breakdown Pie Chart */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex flex-col hover:border-sky-500/30 transition-colors duration-500">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                            <PieChartIcon className="w-5 h-5 text-sky-500" /> Spending Distribution
                        </h2>

                        <div className="h-[250px] w-full">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: any) => `₹${Number(value).toFixed(2)}`}
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px', border: 'none' }}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No expenses for this period.</div>
                            )}
                        </div>

                        {/* Top categories legend list */}
                        <div className="space-y-3 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-sm font-medium text-zinc-300">{entry.name}</span>
                                    </div>
                                    <div className="text-sm font-bold text-white">₹{entry.value.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
