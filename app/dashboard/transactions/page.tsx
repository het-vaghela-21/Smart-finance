"use client";

import { useState } from "react";
import { useDashboard, TransactionCategory } from "@/components/DashboardProvider";
import { ReceiptText, Trash2, ArrowUpRight, ArrowDownRight, Filter, Download, Loader2 } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TransactionsPage() {
    const { transactions, loadingTransactions, deleteTransaction } = useDashboard();
    const [activeTab, setActiveTab] = useState<string>('All');

    // Date Filters
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const dynamicCategories = Array.from(new Set(transactions.map(t => t.category)));
    const categories: string[] = ['All', ...dynamicCategories];

    // Auto separation based on user click & date filter
    const filteredTransactions = transactions.filter(t => {
        let matchTab = activeTab === 'All' || t.category === activeTab;
        if (!matchTab) return false;

        if (startDate) {
            if (isBefore(t.date, startOfDay(new Date(startDate)))) return false;
        }
        if (endDate) {
            if (isAfter(t.date, endOfDay(new Date(endDate)))) return false;
        }

        return true;
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Transaction Ledger Report", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        let subtitle = `Report generated on ${format(new Date(), 'MMM dd, yyyy')}`;
        if (startDate || endDate) {
            subtitle += ` | Period: ${startDate ? format(new Date(startDate), 'MMM dd, yyyy') : 'Start'} to ${endDate ? format(new Date(endDate), 'MMM dd, yyyy') : 'End'}`;
        }
        doc.text(subtitle, 14, 30);

        const tableColumn = ["Date", "Time", "Title", "Category", "Type", "Amount (INR)"];
        const tableRows = filteredTransactions.map(tx => [
            format(tx.date, 'dd/MM/yyyy'),
            format(tx.date, 'hh:mm a'),
            tx.title,
            tx.category,
            tx.type.toUpperCase(),
            `${tx.type === 'credit' ? '+' : '-'} ₹${tx.amount.toFixed(2)}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [34, 197, 94] },
        });

        doc.save("transaction_report.pdf");
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <ReceiptText className="w-8 h-8 text-green-500" /> Transaction Ledger
                    </h1>
                    <p className="text-zinc-400">Search, filter, and export all historic cashflow.</p>
                </div>

                <button
                    onClick={handleDownloadPDF}
                    disabled={filteredTransactions.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" /> Download PDF
                </button>
            </header>

            {/* Date Filters & Category Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Date Selection */}
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-2 rounded-xl text-sm w-full lg:w-auto overflow-x-auto">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-500 ml-2">From:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-white border-none outline-none cursor-pointer w-32 focus:ring-0"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    <div className="w-px h-6 bg-white/10 shrink-0"></div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-500">To:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-white border-none outline-none cursor-pointer w-32 focus:ring-0"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="text-orange-400 hover:text-orange-300 text-xs ml-2 px-2 shrink-0"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
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
            </div>

            {/* Transactions List */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white">Recent Entries</h2>
                </div>

                <div className="divide-y divide-white/5">
                    {loadingTransactions ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-green-500/50" />
                            <p>Loading transactions...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center text-zinc-500">
                            <p>No transactions found for this period/category.</p>
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
                                        disabled={loadingTransactions}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 disabled:opacity-50"
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
