"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { ReceiptText, Trash2, ArrowUpRight, ArrowDownRight, Filter, Download, Loader2 } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const card = {
    background: "rgba(13,13,26,0.70)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
};

export default function TransactionsPage() {
    const { transactions, loadingTransactions, deleteTransaction } = useDashboard();
    const [activeTab, setActiveTab] = useState<string>("All");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const dynamicCategories = Array.from(new Set(transactions.map(t => t.category)));
    const categories: string[] = ["All", ...dynamicCategories];

    const filteredTransactions = transactions.filter(t => {
        const matchTab = activeTab === "All" || t.category === activeTab;
        if (!matchTab) return false;
        if (startDate && isBefore(t.date, startOfDay(new Date(startDate)))) return false;
        if (endDate && isAfter(t.date, endOfDay(new Date(endDate)))) return false;
        return true;
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Transaction Ledger Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        let subtitle = `Report generated on ${format(new Date(), "MMM dd, yyyy")}`;
        if (startDate || endDate) subtitle += ` | Period: ${startDate ? format(new Date(startDate), "MMM dd, yyyy") : "Start"} to ${endDate ? format(new Date(endDate), "MMM dd, yyyy") : "End"}`;
        doc.text(subtitle, 14, 30);
        const tableColumn = ["Date", "Time", "Title", "Category", "Type", "Amount (INR)"];
        const tableRows = filteredTransactions.map(tx => [
            format(tx.date, "dd/MM/yyyy"), format(tx.date, "hh:mm a"), tx.title, tx.category,
            tx.type.toUpperCase(), `${tx.type === "credit" ? "+" : "-"} ₹${tx.amount.toFixed(2)}`
        ]);
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40, theme: "striped", headStyles: { fillColor: [124, 58, 237] } });
        doc.save("transaction_report.pdf");
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <ReceiptText className="w-8 h-8 text-[#22D3EE]" /> Transaction Ledger
                    </h1>
                    <p className="text-zinc-400 mt-0.5">Search, filter, and export all historic cashflow.</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    disabled={filteredTransactions.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: "linear-gradient(135deg, #7C3AED, #22D3EE)",
                        boxShadow: "0 0 18px rgba(124,58,237,0.35)",
                    }}
                >
                    <Download className="w-4 h-4" /> Download PDF
                </button>
            </header>

            {/* Date Filters & Category Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Date */}
                <div className="flex items-center gap-3 p-2 rounded-xl text-sm w-full lg:w-auto overflow-x-auto"
                    style={{ background: "rgba(13,13,26,0.70)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-500 ml-2">From:</span>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            className="bg-transparent text-white border-none outline-none cursor-pointer w-32" style={{ colorScheme: "dark" }} />
                    </div>
                    <div className="w-px h-6 shrink-0" style={{ background: "rgba(124,58,237,0.25)" }} />
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-500">To:</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                            className="bg-transparent text-white border-none outline-none cursor-pointer w-32" style={{ colorScheme: "dark" }} />
                    </div>
                    {(startDate || endDate) && (
                        <button onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-xs ml-2 px-2 transition-colors" style={{ color: "#9F67FF" }}>
                            Reset
                        </button>
                    )}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl shrink-0"
                        style={{ background: "rgba(13,13,26,0.70)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <Filter className="w-4 h-4 text-zinc-500 ml-2" />
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveTab(cat)}
                                className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap")}
                                style={activeTab === cat ? {
                                    background: "rgba(124,58,237,0.18)",
                                    color: "#9F67FF",
                                    border: "1px solid rgba(124,58,237,0.35)",
                                    boxShadow: "0 0 10px rgba(124,58,237,0.20)",
                                } : { color: "#71717A", border: "1px solid transparent" }}
                                onMouseEnter={e => { if (activeTab !== cat) (e.currentTarget.style.color = "#fff"); }}
                                onMouseLeave={e => { if (activeTab !== cat) (e.currentTarget.style.color = "#71717A"); }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="overflow-hidden min-h-[400px]" style={{ ...card, borderRadius: "1.5rem" }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(124,58,237,0.10)", background: "rgba(124,58,237,0.04)" }}>
                    <h2 className="text-lg font-bold text-white">Recent Entries</h2>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    {loadingTransactions ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-[#9F67FF]/50" />
                            <p>Loading transactions...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center text-zinc-500">
                            <p>No transactions found for this period/category.</p>
                        </div>
                    ) : (
                        filteredTransactions.map(tx => (
                            <div key={tx.id} className="p-4 sm:p-6 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.04)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0")}
                                        style={tx.type === "credit"
                                            ? { background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.22)", color: "#22D3EE" }
                                            : { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}>
                                        {tx.type === "credit" ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-lg">{tx.title}</div>
                                        <div className="flex items-center gap-3 text-sm mt-1">
                                            <span className="text-zinc-500 font-mono">{format(tx.date, "MMM dd, yyyy • hh:mm a")}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                            <span className="px-2 py-0.5 rounded-md text-xs font-medium"
                                                style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.22)", color: "#9F67FF" }}>
                                                {tx.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className={cn("text-xl font-bold font-mono text-right", tx.type === "credit" ? "text-[#22D3EE]" : "text-red-400")}>
                                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                                    </div>
                                    <button onClick={() => deleteTransaction(tx.id)} disabled={loadingTransactions}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        style={{ border: "1px solid transparent" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "")}>
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
