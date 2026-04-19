"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { AddTransactionForm } from "@/components/dashboard/AddTransactionForm";
import { CashflowChart } from "@/components/dashboard/CashflowChart";
import { LiveStocksWidget } from "@/components/dashboard/LiveStocksWidget";
import { FinanceNewsWidget } from "@/components/dashboard/FinanceNewsWidget";
import { PieChart, TrendingUp, TrendingDown } from "lucide-react";

/* ── Shared card style ── */
const card = {
    background: "rgba(13,13,26,0.70)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
};

export default function DashboardPage() {
    const { transactions } = useDashboard();

    const { totalBalance, totalCredit, totalDebit } = useMemo(() => {
        let credit = 0, debit = 0;
        for (const t of transactions) {
            if (t.type === "credit") credit += t.amount;
            else debit += t.amount;
        }
        return { totalBalance: credit - debit, totalCredit: credit, totalDebit: debit };
    }, [transactions]);

    const categoryData = useMemo(() => {
        const catMap = new Map<string, number>();
        for (const t of transactions) catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
        return Array.from(catMap.entries()).map(([category, total]) => ({ category, total }));
    }, [transactions]);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10">

            {/* ── Header ── */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter">Command Center</h1>
                    <p className="text-zinc-400 mt-0.5">Total balance and cashflow summary.</p>
                </div>
                <div className="text-right px-5 py-3 rounded-2xl" style={card}>
                    <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Net Worth</div>
                    <div className={`text-2xl font-bold tracking-tighter mt-0.5 ${totalBalance >= 0 ? "gradient-text" : "text-red-400"}`}>
                        ₹{Math.abs(totalBalance).toFixed(2)}
                        {totalBalance < 0 && " −"}
                    </div>
                </div>
            </header>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credits */}
                <div className="p-6 flex items-center justify-between neon-hover-glow transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ ...card, borderLeft: "3px solid #22D3EE" }}>
                    <div>
                        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Credited</div>
                        <div className="text-2xl font-bold text-[#22D3EE] tracking-tight">₹{totalCredit.toFixed(2)}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.25)" }}>
                        <TrendingUp className="w-6 h-6 text-[#22D3EE]" />
                    </div>
                </div>
                {/* Debits */}
                <div className="p-6 flex items-center justify-between neon-hover-glow transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ ...card, borderLeft: "3px solid rgba(239,68,68,0.8)" }}>
                    <div>
                        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Debited</div>
                        <div className="text-2xl font-bold text-red-400 tracking-tight">₹{totalDebit.toFixed(2)}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}>
                        <TrendingDown className="w-6 h-6 text-red-400" />
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                    <CashflowChart />

                    {/* Top Categories */}
                    <div className="p-6" style={card}>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-[#9F67FF]" /> Top Categories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categoryData.length > 0 ? (
                                categoryData.map(({ category, total }) => (
                                    <div key={category}
                                        className="p-4 rounded-xl transition-all cursor-default hover:-translate-y-0.5 neon-hover-glow"
                                        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                                        <div className="text-xs text-zinc-400 font-semibold mb-1">{category}</div>
                                        <div className="text-lg font-bold text-white">₹{total.toFixed(2)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-zinc-500 text-sm py-4">No categories recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    <AddTransactionForm />
                    <LiveStocksWidget />
                    <FinanceNewsWidget />
                </div>
            </div>
        </div>
    );
}
