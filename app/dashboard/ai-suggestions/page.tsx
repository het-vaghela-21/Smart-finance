"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { Bot, User, Sparkles, Send, BrainCircuit, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { id: string; sender: 'ai' | 'user'; text: string };

export default function AiSuggestionsPage() {
    const { transactions } = useDashboard();

    // Quick analysis based on tx data
    const totalSpent = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const topCategory = Object.entries(
        transactions.filter(t => t.type === 'debit').reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category as keyof typeof acc] || 0) + t.amount }), {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    const initialAiMessage = `Hello Architect. I've analyzed your recent portfolio. You've spent ₹${totalSpent.toFixed(2)} recently. It appears you have heavy expenditures in **${topCategory[0]}**. I recommend allocating 15% of that capital into high-yield dividend stocks to generate passive returns. How can I help you optimize your wealth today?`;

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'ai', text: initialAiMessage }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const sentInput = input;
        if (!sentInput.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: sentInput };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: sentInput, transactions })
            });

            const data = await res.json();

            if (res.ok) {
                const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: `*[System Alert]* Could not connect to Neural Engine: ${data.error}` };
                setMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "*[System Alert]* Neural link severed. Network error." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 h-[calc(100vh-100px)] flex flex-col pb-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <Bot className="w-8 h-8 text-fuchsia-500" /> Neural Advisor
                    </h1>
                    <p className="text-zinc-400">Predictive insights and intelligent capital allocation chatbot.</p>
                </div>
                <div className="flex items-center gap-3 bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-2 rounded-full">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-fuchsia-400">Core Active</span>
                </div>
            </header>

            {/* Top Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-fuchsia-500" />
                    </div>
                    <div className="text-fuchsia-500 font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Risk Assessment</div>
                    <div className="text-white text-xl font-bold mb-1">Moderate-High</div>
                    <div className="text-zinc-400 text-sm">Portfolio Beta: 1.25</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-16 h-16 text-fuchsia-500" />
                    </div>
                    <div className="text-fuchsia-500 font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Optimization</div>
                    <div className="text-white text-lg font-bold mb-1 leading-tight">Reduce {topCategory[0]}</div>
                    <div className="text-zinc-400 text-sm">Potential Savings: ₹{(Number(topCategory[1]) * 0.2).toFixed(2)}</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-fuchsia-500" />
                    </div>
                    <div className="text-fuchsia-500 font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Projected Yield</div>
                    <div className="text-white text-xl font-bold mb-1">+18.4% APY</div>
                    <div className="text-zinc-400 text-sm">Following neural strategy</div>
                </div>
            </div>

            {/* Algorithmic Portfolio Synthesis (Fallback) */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-400 flex items-center justify-center border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg">Portfolio Synthesis</div>
                        <div className="text-fuchsia-400 text-xs font-semibold">Local Neural Algorithms Active</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {/* Insights Block 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Cash Flow Pattern
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) > totalSpent
                                    ? "Your portfolio is currently Cash Flow Positive. You are accumulating capital faster than your expenditure burn rate. This is an optimal state for aggressive wealth building."
                                    : "Warning: Your portfolio is currently Cash Flow Negative. Your expenditure burn rate is outpacing capital accumulation. Rebalancing your budget is highly recommended to prevent capital degradation."
                                }
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Priority Action</div>
                            <div className="text-sm font-bold text-white mt-1">Review top expenditures in <span className="text-fuchsia-400">{topCategory[0]}</span></div>
                        </div>
                    </div>

                    {/* Insights Block 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Capital Allocation Strategy
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                Based on historic volatility models, holding excessive cash degrades purchasing power.
                                By optimizing your <span className="text-white font-bold">{topCategory[0]}</span> outflow by just 15%, you could redirect <span className="text-green-400 font-medium">₹{(Number(topCategory[1]) * 0.15).toFixed(2)}</span> monthly into high-yield index funds.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Model Suggestion</div>
                            <div className="text-sm font-bold text-white mt-1">Deploy 20% of net balance to S&P 500 ETFs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
