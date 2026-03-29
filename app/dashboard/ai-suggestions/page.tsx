"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Bot, Send, TrendingUp, AlertTriangle, Lightbulb, Wallet, ArrowRight, Loader2 } from "lucide-react";
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

export default function AISuggestionsPage() {
    const { transactions, loadingTransactions } = useDashboard();

    const [message, setMessage] = useState("");
    const [insights, setInsights] = useState<Insight[]>([]);
    const [healthScore, setHealthScore] = useState<number | null>(null);
    const [healthText, setHealthText] = useState("");
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [insightError, setInsightError] = useState("");

    const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: "Hello! I'm your embedded financial AI powered by Gemini 2.5 Flash. I have full read access to your transactions matrix. Want me to analyze your latest spending trends or suggest a budget?" }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, chatLoading]);

    // Fetch initial insights when transactions load
    useEffect(() => {
        const fetchInsights = async () => {
            if (loadingTransactions || transactions.length === 0 || insights.length > 0 || loadingInsights) return;

            setLoadingInsights(true);
            setInsightError("");
            try {
                const res = await fetch('/api/ai/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactions })
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to fetch");
                }
                const { data } = await res.json();

                setInsights(data.insights || []);
                setHealthScore(data.healthScore || 0);
                setHealthText(data.insightText || "");
            } catch (err: any) {
                console.error("Insights fetch error:", err);
                setInsightError(err.message || "The AI encountered an error while parsing your financial matrix.");
            } finally {
                setLoadingInsights(false);
            }
        };

        fetchInsights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions, loadingTransactions]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimMsg = message.trim();
        if (!trimMsg || chatLoading) return;

        // Optimistically add user message
        setChatHistory(prev => [...prev, { role: 'user', content: trimMsg }]);
        setMessage("");
        setChatLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimMsg, transactions })
            });
            if (!res.ok) throw new Error("Failed to get chat response");
            const data = await res.json();

            setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, { role: 'ai', content: "I encountered an error processing that request." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const getIcon = (type: string) => {
        if (type === 'warning') return <AlertTriangle className="w-6 h-6" />;
        if (type === 'opportunity') return <TrendingUp className="w-6 h-6" />;
        return <Lightbulb className="w-6 h-6" />;
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" /> AI Financial Advisor
                    </h1>
                    <p className="text-zinc-400">Personalized insights and intelligent chatbot workspace.</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    Gemini 2.5 Active
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: AI Insights & Suggestions */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl min-h-[400px]">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" /> Smart Insights
                        </h2>

                        {loadingTransactions || loadingInsights ? (
                            <div className="flex flex-col items-center justify-center p-12 text-zinc-500 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                                <p>Artificial Intelligence is crunching your data...</p>
                            </div>
                        ) : insightError ? (
                            <div className="p-12 text-center text-red-400 border border-red-500/10 rounded-2xl bg-red-500/5">
                                <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                <p>{insightError}</p>
                                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors">Retry Analysis</button>
                            </div>
                        ) : insights.length > 0 ? (
                            <div className="space-y-4">
                                {insights.map(insight => (
                                    <div key={insight.id} className={cn(
                                        "p-5 rounded-2xl border transition-all hover:bg-white/[0.02]",
                                        insight.bg, insight.border
                                    )}>
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
                            <div className="p-12 text-center text-zinc-500 border border-white/5 rounded-2xl border-dashed">
                                No transactions found to analyze. Add some transactions to surface insights!
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-sky-500" /> Portfolio Health Score
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-sky-500/20 border-t-sky-500 flex items-center justify-center shrink-0">
                                <span className="text-3xl font-bold text-white">
                                    {healthScore !== null ? healthScore : "--"}
                                    <span className="text-lg text-zinc-500">/100</span>
                                </span>
                            </div>
                            <div className="text-zinc-400 text-sm">
                                {healthText ? healthText : "Loading scoring algorithms..."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Chatbot UI Workspace */}
                <div className="lg:col-span-5 h-[600px] lg:h-[800px] flex flex-col">
                    <div className="glass-panel rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex flex-col flex-1 overflow-hidden relative shadow-[0_0_30px_rgba(249,115,22,0.05)]">

                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
                                <Bot className="w-5 h-5 text-primary" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold">FinAI Assistant</h3>
                                <p className="text-xs text-zinc-500">Always active • Deep Context</p>
                            </div>
                        </div>

                        {/* Chat History Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            <div className="flex justify-center">
                                <span className="text-xs text-zinc-600 bg-white/5 px-3 py-1 rounded-full">Conversation started</span>
                            </div>

                            {chatHistory.map((msg, i) => (
                                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center border shrink-0",
                                        msg.role === 'ai' ? "bg-primary/20 border-primary/30" : "bg-zinc-800 border-white/10"
                                    )}>
                                        {msg.role === 'ai' ? <Bot className="w-4 h-4 text-primary" /> : <span className="text-[10px] font-bold text-white">ME</span>}
                                    </div>
                                    <div className={cn(
                                        "border rounded-2xl p-3 max-w-[85%] text-sm shadow-sm",
                                        msg.role === 'ai'
                                            ? "bg-white/5 border-white/5 rounded-tl-none text-zinc-300"
                                            : "bg-primary/20 border-primary/30 rounded-tr-none text-white whitespace-pre-wrap"
                                    )}>
                                        {msg.role === 'ai' ? (
                                            <div className="space-y-2 [&>p:last-child]:mb-0">
                                                <ReactMarkdown
                                                    components={{
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* AI Message Loading */}
                            {chatLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
                            <form className="relative" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Message FinAI..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                    disabled={chatLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={message.trim().length === 0 || chatLoading}
                                    className={cn(
                                        "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                                        message.trim().length > 0
                                            ? "bg-primary text-white hover:bg-orange-600 shadow-md"
                                            : "bg-transparent text-zinc-500"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
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
