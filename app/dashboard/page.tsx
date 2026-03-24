"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { AddTransactionForm } from "@/components/dashboard/AddTransactionForm";
import { CashflowChart } from "@/components/dashboard/CashflowChart";
import { LiveStocksWidget } from "@/components/dashboard/LiveStocksWidget";
import { PieChart, ListFilter, Zap } from "lucide-react";

export default function DashboardPage() {
    const { transactions } = useDashboard();

    // Calculate quick stats
    const totalBalance = transactions.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
    const totalCredit = transactions.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc, 0);
    const totalDebit = transactions.reduce((acc, t) => t.type === 'debit' ? acc + t.amount : acc, 0);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10">
            {/* Header Area */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter">Command Center</h1>
                    <p className="text-zinc-400">Total balance and cashflow summary.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Net Worth</div>
                        <div className={`text-2xl font-bold tracking-tighter ${totalBalance >= 0 ? "text-white" : "text-red-400"}`}>
                            ₹{Math.abs(totalBalance).toFixed(2)}
                            {totalBalance < 0 && "-"}
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Credited</div>
                        <div className="text-2xl font-bold text-green-500 tracking-tight">₹{totalCredit.toFixed(2)}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-green-500" />
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Debited</div>
                        <div className="text-2xl font-bold text-red-500 tracking-tight">₹{totalDebit.toFixed(2)}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ListFilter className="w-6 h-6 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Charts & Overview */}
                <div className="lg:col-span-8 space-y-6">
                    <CashflowChart />

                    {/* Top Categories Row */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-primary" /> Top Categories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {["Food", "Shopping", "Jewellery", "Stocks", "Travel", "Miscellaneous"].map(category => {
                                const catTotal = transactions
                                    .filter(t => t.category === category && t.type === 'debit')
                                    .reduce((sum, t) => sum + t.amount, 0);

                                return (
                                    <div key={category} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                        <div className="text-xs text-zinc-400 font-semibold mb-1">{category}</div>
                                        <div className="text-lg font-bold text-white">₹{catTotal.toFixed(2)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Add tx & Stocks */}
                <div className="lg:col-span-4 space-y-6">
                    <AddTransactionForm />
                    <LiveStocksWidget />
                </div>
            </div>
        </div>
    );
}
