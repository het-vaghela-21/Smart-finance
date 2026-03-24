"use client";

import { useState } from "react";
import { useDashboard, TransactionCategory, Transaction } from "@/components/DashboardProvider";
import { ReceiptText, Trash2, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
    const { transactions, deleteTransaction } = useDashboard();
    const [activeTab, setActiveTab] = useState<TransactionCategory | 'All'>('All');

    const categories: ('All' | TransactionCategory)[] = ['All', 'Food', 'Shopping', 'Jewellery', 'Stocks', 'Travel', 'Miscellaneous'];

    // Auto separation based on user click
    const filteredTransactions = transactions.filter(t => activeTab === 'All' || t.category === activeTab);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <ReceiptText className="w-8 h-8 text-green-500" /> Transaction Ledger
                    </h1>
                    <p className="text-zinc-400">Search, filter, and review all historic cashflow separated automatically.</p>
                </div>
            </header>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl">
                    <Filter className="w-4 h-4 text-zinc-500 ml-2" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border border-transparent",
                                activeTab === cat
                                    ? "bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] border-green-500/30"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white">Recent Entries</h2>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            No transactions found for this category.
                        </div>
                    ) : (
                        filteredTransactions.map(tx => (
                            <div key={tx.id} className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner",
                                        tx.type === 'credit' ? "bg-green-500/10 border border-green-500/20 text-green-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
                                    )}>
                                        {tx.type === 'credit' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-lg hover:text-green-400 transition-colors cursor-pointer">{tx.title}</div>
                                        <div className="flex items-center gap-3 text-sm mt-1">
                                            <span className="text-zinc-500 font-mono">{format(tx.date, 'MMM dd, yyyy • hh:mm a')}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                                            <span className="text-green-500/80 font-medium px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-xs">
                                                {tx.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className={cn(
                                        "text-xl font-bold font-mono text-right",
                                        tx.type === 'credit' ? "text-green-500" : "text-red-500"
                                    )}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => deleteTransaction(tx.id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
