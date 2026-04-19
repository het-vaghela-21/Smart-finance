"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import dynamic from "next/dynamic";
import { format } from "date-fns";

// ── Dynamically import the entire Recharts LineChart bundle ──
// This prevents ~250KB of Recharts JS from blocking the first paint.
// A skeleton is shown while the chart JS loads.
const DynamicLineChart = dynamic(
    () => import("recharts").then((m) => {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = m;

        // Return a wrapper component so we can pass props cleanly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function RechartsLineChart({ data }: { data: any[] }) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(v) => `₹${v}`} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#0D0D1A", borderColor: "rgba(124,58,237,0.25)", borderRadius: "12px", color: "#fff" }} itemStyle={{ fontWeight: "bold" }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                        <Line type="monotone" dataKey="debit" name="Debit" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: "#f87171", strokeWidth: 2, stroke: "#0D0D1A" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#f87171" }} />
                        <Line type="monotone" dataKey="credit" name="Credit" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4, fill: "#22D3EE", strokeWidth: 2, stroke: "#0D0D1A" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#22D3EE" }} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
        return RechartsLineChart;
    }),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center">
                <div className="space-y-3 w-full px-4">
                    {/* Animated skeleton bars */}
                    <div className="h-2 rounded-full animate-pulse" style={{ background: "rgba(124,58,237,0.15)", width: "60%" }} />
                    <div className="flex items-end gap-2 h-48 pt-4">
                        {[45, 70, 35, 80, 55, 90, 40, 65].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-sm animate-pulse"
                                style={{
                                    height: `${h}%`,
                                    background: i % 2 === 0
                                        ? "rgba(124,58,237,0.18)"
                                        : "rgba(34,211,238,0.12)",
                                    animationDelay: `${i * 80}ms`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
            </div>
        ),
    }
);

export function CashflowChart() {
    const { transactions } = useDashboard();

    const chartData = useMemo(() => {
        const grouped: Record<string, { date: string; timestamp: number; debit: number; credit: number }> = {};
        transactions.forEach((t) => {
            const dateStr = format(t.date, "MMM dd");
            if (!grouped[dateStr]) grouped[dateStr] = { date: dateStr, timestamp: t.date.getTime(), debit: 0, credit: 0 };
            if (t.type === "debit") grouped[dateStr].debit += t.amount;
            else grouped[dateStr].credit += t.amount;
        });
        const data = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
        if (data.length < 3) {
            data.unshift({ date: format(new Date(Date.now() - 86400000 * 15), "MMM dd"), timestamp: 0, debit: 200, credit: 0 });
            data.unshift({ date: format(new Date(Date.now() - 86400000 * 20), "MMM dd"), timestamp: 0, debit: 0, credit: 1500 });
        }
        return data;
    }, [transactions]);

    return (
        <div
            className="glass-panel p-6 h-[400px] flex flex-col"
            style={{ borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.07)" }}
        >
            <h2 className="text-xl font-bold text-white mb-6">Cashflow Overview</h2>
            <div className="flex-1 w-full min-h-0">
                <DynamicLineChart data={chartData} />
            </div>
        </div>
    );
}
