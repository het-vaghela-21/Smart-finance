"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import dynamic from "next/dynamic";
import { format, subDays, subMonths, isAfter } from "date-fns";
import { BarChart3, Clock, PieChart as PieChartIcon } from "lucide-react";

type TimeRange = "7D" | "1M" | "6M" | "1Y" | "ALL";

const COLORS = ["#7C3AED", "#22D3EE", "#4ADE80", "#F472B6", "#FBBF24", "#9F67FF"];

const card = {
    background: "rgba(13,13,26,0.70)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
};

const tooltipStyle = {
    backgroundColor: "#0D0D1A",
    borderColor: "rgba(124,58,237,0.25)",
    borderRadius: "12px",
};

// ── Chart skeleton shared by all loading states ──
function ChartSkeleton({ height = 400 }: { height?: number }) {
    return (
        <div className="w-full flex items-end gap-1.5 px-2" style={{ height }}>
            {[30, 55, 40, 75, 50, 90, 35, 60, 80, 45, 70, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm animate-pulse"
                    style={{ height: `${h}%`, background: i % 2 === 0 ? "rgba(124,58,237,0.14)" : "rgba(34,211,238,0.10)", animationDelay: `${i * 60}ms` }} />
            ))}
        </div>
    );
}

// ── Dynamically import all three Recharts chart types ──
const DynamicLineChart = dynamic(
    () => import("recharts").then((m) => {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = m;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function LC({ data }: { data: any[] }) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={v => `₹${v}`} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend iconType="circle" />
                        <Line type="monotone" dataKey="debit" name="Debit" stroke="#f87171" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#f87171" }} />
                        <Line type="monotone" dataKey="credit" name="Credit" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#22D3EE" }} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
        return LC;
    }),
    { ssr: false, loading: () => <ChartSkeleton /> }
);

const DynamicBarChart = dynamic(
    () => import("recharts").then((m) => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = m;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function BC({ data }: { data: any[] }) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={v => `₹${v}`} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: "transparent" }} contentStyle={tooltipStyle} />
                        <Legend iconType="circle" />
                        <Bar dataKey="debit" name="Debit" fill="#f87171" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="credit" name="Credit" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            );
        }
        return BC;
    }),
    { ssr: false, loading: () => <ChartSkeleton /> }
);

const DynamicPieChart = dynamic(
    () => import("recharts").then((m) => {
        const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = m;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function PC({ data }: { data: { name: string; value: number }[] }) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Tooltip formatter={(v: any) => `₹${Number(v).toFixed(2)}`} contentStyle={tooltipStyle} />
                    </PieChart>
                </ResponsiveContainer>
            );
        }
        return PC;
    }),
    { ssr: false, loading: () => <ChartSkeleton height={250} /> }
);

export default function ChartsPage() {
    const { transactions } = useDashboard();
    const [timeRange, setRange] = useState<TimeRange>("1M");

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const cutoff =
            timeRange === "7D" ? subDays(now, 7) :
            timeRange === "1M" ? subMonths(now, 1) :
            timeRange === "6M" ? subMonths(now, 6) :
            timeRange === "1Y" ? subMonths(now, 12) : new Date(0);
        return transactions.filter(t => isAfter(t.date, cutoff));
    }, [transactions, timeRange]);

    const timeSeriesData = useMemo(() => {
        const grouped: Record<string, { date: string; timestamp: number; debit: number; credit: number }> = {};
        filteredTransactions.forEach(t => {
            const dateStr = format(t.date, "MMM dd");
            if (!grouped[dateStr]) grouped[dateStr] = { date: dateStr, timestamp: t.date.getTime(), debit: 0, credit: 0 };
            if (t.type === "debit") grouped[dateStr].debit += t.amount;
            else grouped[dateStr].credit += t.amount;
        });
        const data = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
        if (data.length === 0) data.push({ date: format(new Date(), "MMM dd"), timestamp: Date.now(), debit: 0, credit: 0 });
        return data;
    }, [filteredTransactions]);

    const categoryData = useMemo(() => {
        const grouped: Record<string, number> = {};
        filteredTransactions.forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
        return Object.entries(grouped).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    const totalDebitForPeriod = filteredTransactions.reduce((acc, t) => t.type === "debit" ? acc + t.amount : acc, 0);
    const totalCreditForPeriod = filteredTransactions.reduce((acc, t) => t.type === "credit" ? acc + t.amount : acc, 0);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-[#9F67FF]" /> Deep Analytics
                    </h1>
                    <p className="text-zinc-400 mt-0.5">Advanced cashflow and categorization visualizations.</p>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: "rgba(13,13,26,0.70)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Clock className="w-4 h-4 text-zinc-400 ml-2" />
                    {(["7D", "1M", "6M", "1Y", "ALL"] as TimeRange[]).map(range => (
                        <button key={range} onClick={() => setRange(range)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={timeRange === range ? {
                                background: "rgba(124,58,237,0.20)", color: "#9F67FF",
                                border: "1px solid rgba(124,58,237,0.35)", boxShadow: "0 0 10px rgba(124,58,237,0.20)",
                            } : { color: "#71717A", border: "1px solid transparent" }}>
                            {range}
                        </button>
                    ))}
                </div>
            </header>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Period Debits",  value: `₹${totalDebitForPeriod.toFixed(2)}`,  color: "#f87171", border: "rgba(239,68,68,0.25)" },
                    { label: "Period Credits", value: `₹${totalCreditForPeriod.toFixed(2)}`, color: "#22D3EE", border: "rgba(34,211,238,0.25)" },
                    { label: "Net Diff",       value: `₹${Math.abs(totalCreditForPeriod - totalDebitForPeriod).toFixed(2)}`,
                      color: totalCreditForPeriod >= totalDebitForPeriod ? "#22D3EE" : "#f87171",
                      border: totalCreditForPeriod >= totalDebitForPeriod ? "rgba(34,211,238,0.25)" : "rgba(239,68,68,0.25)" },
                    { label: "Transactions",   value: String(filteredTransactions.length),   color: "#9F67FF", border: "rgba(124,58,237,0.25)" },
                ].map(s => (
                    <div key={s.label} className="p-4 rounded-2xl neon-hover-glow"
                        style={{ ...card, borderLeft: `3px solid ${s.border}` }}>
                        <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">{s.label}</div>
                        <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="p-6 h-[400px] flex flex-col neon-hover-glow" style={card}>
                        <h2 className="text-xl font-bold text-white mb-6">Debit vs Credit (Trend)</h2>
                        <div className="flex-1 w-full min-h-0"><DynamicLineChart data={timeSeriesData} /></div>
                    </div>
                    <div className="p-6 h-[400px] flex flex-col neon-hover-glow" style={card}>
                        <h2 className="text-xl font-bold text-white mb-6">Gross Volume per Day</h2>
                        <div className="flex-1 w-full min-h-0"><DynamicBarChart data={timeSeriesData} /></div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="p-6 flex flex-col neon-hover-glow" style={card}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                            <PieChartIcon className="w-5 h-5 text-[#9F67FF]" /> Spending Distribution
                        </h2>
                        <div className="h-[250px] w-full">
                            {categoryData.length > 0
                                ? <DynamicPieChart data={categoryData} />
                                : <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No expenses for this period.</div>}
                        </div>
                        <div className="space-y-3 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between p-2 rounded-xl transition-colors"
                                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.06)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "")}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
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
