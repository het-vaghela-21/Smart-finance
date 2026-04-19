"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Bot, Send, TrendingUp, AlertTriangle, Lightbulb, Wallet, Loader2, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/components/DashboardProvider";
import ReactMarkdown from "react-markdown";

type Insight = {
    id: number;
    type: "warning" | "opportunity" | "tip";
    title: string;
    desc: string;
    color: string;
    bg: string;
    border: string;
};

const CACHE_KEY = "finai_insights_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getCachedInsights() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_TTL_MS) { localStorage.removeItem(CACHE_KEY); return null; }
        return data;
    } catch { return null; }
}

function setCachedInsights(data: object) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })); } catch { }
}

function clearInsightsCache() {
    try { localStorage.removeItem(CACHE_KEY); } catch { }
}

const card = {
    background: "rgba(13,13,26,0.70)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
};

export default function AISuggestionsPage() {
    const { transactions, loadingTransactions } = useDashboard();
    const [message, setMessage] = useState("");
    const [insights, setInsights] = useState<Insight[]>([]);
    const [healthScore, setHealthScore] = useState<number | null>(null);
    const [healthText, setHealthText] = useState("");
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [insightError, setInsightError] = useState("");
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [chatHistory, setChatHistory] = useState<{ role: "ai" | "user"; content: string }[]>([
        { role: "ai", content: "Hello! I'm your embedded financial AI powered by Gemini 2.0 Flash. I have full read access to your transactions matrix. Want me to analyze your latest spending trends or suggest a budget?" }
    ]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (retryCountdown <= 0) return;
        const timer = setInterval(() => setRetryCountdown(p => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; }), 1000);
        return () => clearInterval(timer);
    }, [retryCountdown]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, chatLoading]);

    const fetchInsights = async (forceRefresh = false) => {
        if (loadingTransactions || transactions.length === 0 || loadingInsights) return;
        if (!forceRefresh) {
            const cached = getCachedInsights();
            if (cached) { setInsights(cached.insights || []); setHealthScore(cached.healthScore || 0); setHealthText(cached.insightText || ""); return; }
        }
        setLoadingInsights(true);
        setInsightError("");
        try {
            const res = await fetch("/api/ai/insights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactions }) });
            if (!res.ok) {
                const errData = await res.json();
                const retryMatch = errData.error?.match(/retry[^0-9]*(\d+(\.\d+)?)\s*s/i);
                if (retryMatch) { setRetryCountdown(Math.ceil(parseFloat(retryMatch[1]))); throw new Error(`Rate limit reached. Please wait ${Math.ceil(parseFloat(retryMatch[1]))} seconds before retrying.`); }
                throw new Error(errData.error || "Failed to fetch");
            }
            const { data } = await res.json();
            setInsights(data.insights || []);
            setHealthScore(data.healthScore || 0);
            setHealthText(data.insightText || "");
            setCachedInsights(data);
        } catch (error: unknown) {
            const err = error as Error;
            setInsightError(err.message || "The AI encountered an error while parsing your financial matrix.");
        } finally {
            setLoadingInsights(false);
        }
    };

    useEffect(() => {
        if (loadingTransactions || transactions.length === 0 || insights.length > 0 || loadingInsights) return;
        fetchInsights(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions, loadingTransactions]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimMsg = message.trim();
        if (!trimMsg || chatLoading) return;
        setChatHistory(prev => [...prev, { role: "user", content: trimMsg }]);
        setMessage("");
        setChatLoading(true);
        try {
            const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: trimMsg, transactions }) });
            if (!res.ok) throw new Error("Failed to get chat response");
            const data = await res.json();
            setChatHistory(prev => [...prev, { role: "ai", content: data.reply }]);
        } catch {
            setChatHistory(prev => [...prev, { role: "ai", content: "I encountered an error processing that request." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const getIcon = (type: string) => {
        if (type === "warning") return <AlertTriangle className="w-6 h-6" />;
        if (type === "opportunity") return <TrendingUp className="w-6 h-6" />;
        return <Lightbulb className="w-6 h-6" />;
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-[#9F67FF]" /> AI Financial Advisor
                    </h1>
                    <p className="text-zinc-400 mt-0.5">Personalized insights and intelligent chatbot workspace.</p>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", color: "#9F67FF", boxShadow: "0 0 15px rgba(124,58,237,0.18)" }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#9F67FF" }} />
                    Gemini 2.0 Active
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Insights + Health */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Smart Insights */}
                    <div className="p-6 min-h-[400px]" style={card}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400" /> Smart Insights
                            </h2>
                            {insights.length > 0 && (
                                <button onClick={() => { clearInsightsCache(); fetchInsights(true); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                                    style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)", color: "#9F67FF" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.20)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,58,237,0.10)")}>
                                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                                </button>
                            )}
                        </div>

                        {loadingTransactions || loadingInsights ? (
                            <div className="flex flex-col items-center justify-center p-12 text-zinc-500 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-[#9F67FF]/50" />
                                <p>Artificial Intelligence is crunching your data...</p>
                            </div>
                        ) : insightError ? (
                            <div className="p-12 text-center text-red-400 rounded-2xl"
                                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                <p className="text-sm leading-relaxed">{insightError}</p>
                                {retryCountdown > 0 ? (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 text-sm">
                                        <Clock className="w-4 h-4 animate-pulse" />
                                        <span>Retry available in <span className="text-white font-bold">{retryCountdown}s</span></span>
                                    </div>
                                ) : (
                                    <button onClick={() => { clearInsightsCache(); fetchInsights(true); }}
                                        className="mt-4 px-4 py-2 rounded-lg text-sm transition-colors text-red-300"
                                        style={{ background: "rgba(239,68,68,0.12)" }}>
                                        Retry Analysis
                                    </button>
                                )}
                            </div>
                        ) : insights.length > 0 ? (
                            <div className="space-y-4">
                                {insights.map(insight => (
                                    <div key={insight.id} className={cn("p-5 rounded-2xl border transition-all hover:bg-white/[0.02]", insight.bg, insight.border)}>
                                        <div className="flex items-start gap-4">
                                            <div className={cn("p-3 rounded-xl bg-black/20 backdrop-blur-md shrink-0", insight.color)}>
                                                {getIcon(insight.type)}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{insight.title}</h3>
                                                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{insight.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-zinc-500 rounded-2xl border border-dashed" style={{ borderColor: "rgba(124,58,237,0.20)" }}>
                                No transactions found to analyze. Add some transactions to surface insights!
                            </div>
                        )}
                    </div>

                    {/* Health Score */}
                    <div className="p-6" style={card}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-[#22D3EE]" /> Portfolio Health Score
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                                style={{ border: "4px solid rgba(124,58,237,0.15)", borderTopColor: "#7C3AED" }}>
                                <span className="text-3xl font-bold text-white">
                                    {healthScore !== null ? healthScore : "--"}
                                    <span className="text-lg text-zinc-500">/100</span>
                                </span>
                            </div>
                            <div className="text-zinc-400 text-sm leading-relaxed">
                                {healthText ? healthText : "Loading scoring algorithms..."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Chatbot */}
                <div className="lg:col-span-5 h-[600px] lg:h-[800px] flex flex-col">
                    <div className="flex flex-col flex-1 overflow-hidden"
                        style={{ ...card, boxShadow: "0 0 30px rgba(124,58,237,0.08)" }}>
                        {/* Chat Header */}
                        <div className="p-4 flex items-center gap-3 shrink-0"
                            style={{ borderBottom: "1px solid rgba(124,58,237,0.12)", background: "rgba(124,58,237,0.05)" }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border relative"
                                style={{ background: "rgba(124,58,237,0.18)", borderColor: "rgba(124,58,237,0.35)" }}>
                                <Bot className="w-5 h-5 text-[#9F67FF]" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 rounded-full"
                                    style={{ background: "#4ADE80", borderColor: "#0D0D1A" }} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">FinAI Assistant</h3>
                                <p className="text-xs text-zinc-500">Always active • Deep Context</p>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            <div className="flex justify-center">
                                <span className="text-xs text-zinc-600 px-3 py-1 rounded-full"
                                    style={{ background: "rgba(255,255,255,0.04)" }}>Conversation started</span>
                            </div>
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0"
                                        style={msg.role === "ai"
                                            ? { background: "rgba(124,58,237,0.18)", borderColor: "rgba(124,58,237,0.35)" }
                                            : { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}>
                                        {msg.role === "ai" ? <Bot className="w-4 h-4 text-[#9F67FF]" /> : <span className="text-[10px] font-bold text-white">ME</span>}
                                    </div>
                                    <div className="rounded-2xl p-3 max-w-[85%] text-sm shadow-sm"
                                        style={msg.role === "ai"
                                            ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderTopLeftRadius: "4px", color: "#D4D4D8" }
                                            : { background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.35)", borderTopRightRadius: "4px", color: "#fff" }}>
                                        {msg.role === "ai" ? (
                                            <div className="space-y-2">
                                                    <ReactMarkdown components={{
                                                    strong: ({ ...props }: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold text-white" {...props} />,
                                                    ul: ({ ...props }: React.ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                                    ol: ({ ...props }: React.ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                                                }}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : msg.content}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0"
                                        style={{ background: "rgba(124,58,237,0.18)", borderColor: "rgba(124,58,237,0.35)" }}>
                                        <Bot className="w-4 h-4 text-[#9F67FF]" />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-1.5"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                        {[0, 150, 300].map(d => (
                                            <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                                style={{ background: "#9F67FF", animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(124,58,237,0.10)", background: "rgba(0,0,0,0.20)" }}>
                            <form className="relative" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Message FinAI..."
                                    className="w-full rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-600"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    onFocus={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.50)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.10)"; }}
                                    onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                                    disabled={chatLoading}
                                />
                                <button type="submit" disabled={message.trim().length === 0 || chatLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all"
                                    style={message.trim().length > 0
                                        ? { background: "linear-gradient(135deg, #7C3AED, #22D3EE)", boxShadow: "0 0 12px rgba(124,58,237,0.35)" }
                                        : { background: "transparent", opacity: 0.4 }}>
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </form>
                            <p className="text-[10px] text-zinc-600 text-center mt-2 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI can make mistakes. Verify critical actions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
