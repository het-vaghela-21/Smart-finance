"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { Target, PlusCircle, Trash2, TrendingUp, HandCoins, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function GoalsPage() {
    const { goals, loadingGoals, addGoal, addFundsToGoal, deleteGoal } = useDashboard();
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    
    // Quick Add Funds States
    const [fundingGoalId, setFundingGoalId] = useState<string | null>(null);
    const [fundingAmount, setFundingAmount] = useState("");

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount) return;

        await addGoal({
            title,
            targetAmount: parseFloat(targetAmount)
        });

        setTitle("");
        setTargetAmount("");
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fundingGoalId || !fundingAmount) return;

        await addFundsToGoal(fundingGoalId, parseFloat(fundingAmount));
        setFundingGoalId(null);
        setFundingAmount("");
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary" /> Financial Goals
                    </h1>
                    <p className="text-zinc-400">Set targets and track your progress to financial freedom.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Goal Form */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-primary" /> Create New Goal
                        </h2>

                        <form onSubmit={handleCreateGoal} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Goal Name</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Dream Car, Vacation..."
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Target Amount (₹)</label>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="100000"
                                    min="1"
                                    step="0.01"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-primary hover:bg-orange-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] mt-2"
                            >
                                Set Target
                            </button>
                        </form>
                    </div>
                </div>

                {/* Goals List */}
                <div className="lg:col-span-2 space-y-6">
                    {loadingGoals ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-48 rounded-3xl bg-white/5 border border-white/5" />
                            ))}
                        </div>
                    ) : goals.length === 0 ? (
                        <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm">
                            <Target className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No active goals</h3>
                            <p className="text-zinc-500">Create your first financial goal to start tracking progress.</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            const isCompleted = progress >= 100;

                            return (
                                <div key={goal.id} className="relative glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden group">
                                    {/* Background glow if completed */}
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-green-500/5 backdrop-blur-sm z-0 pointer-events-none" />
                                    )}
                                    
                                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                                {goal.title}
                                                {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                                            </h3>
                                            <p className="text-zinc-500 text-sm mt-1">
                                                Started on {format(goal.createdAt, 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {!isCompleted && fundingGoalId !== goal.id && (
                                                <button
                                                    onClick={() => setFundingGoalId(goal.id)}
                                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-primary hover:text-white text-zinc-300 transition-all font-medium flex items-center justify-center gap-2"
                                                >
                                                    <HandCoins className="w-4 h-4" /> Add Funds
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteGoal(goal.id)}
                                                className="p-2.5 rounded-xl bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
                                                title="Delete Goal"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add Funds Quick Form */}
                                    {fundingGoalId === goal.id && (
                                        <form onSubmit={handleAddFunds} className="relative z-10 mb-6 flex gap-2 w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
                                            <input
                                                type="number"
                                                value={fundingAmount}
                                                onChange={e => setFundingAmount(e.target.value)}
                                                placeholder="Amount to add (₹)"
                                                min="1"
                                                step="0.01"
                                                required
                                                autoFocus
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary/50 transition-colors"
                                            />
                                            <button type="submit" className="px-4 py-2 bg-primary rounded-xl text-white font-bold hover:bg-orange-500 transition-colors">
                                                Confirm
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => { setFundingGoalId(null); setFundingAmount(""); }}
                                                className="px-4 py-2 bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    )}

                                    {/* Tracker / Progress Bar */}
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-zinc-300">
                                                <span className="text-xl font-bold text-white tracking-tight mr-1">
                                                    ₹{goal.currentAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </span>
                                                saved
                                            </span>
                                            <span className="text-zinc-500">
                                                Target: <span className="text-white">₹{goal.targetAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                            </span>
                                        </div>
                                        
                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isCompleted ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-primary shadow-[0_0_20px_rgba(249,115,22,0.4)]'}`}
                                                style={{ width: `${progress}%` }}
                                            >
                                                {/* Shimmer effect for progress bar */}
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between text-xs text-zinc-500 font-medium">
                                            <span>
                                                {isCompleted ? "Goal Reached! 🎉" : `${progress.toFixed(1)}% Achieved`}
                                            </span>
                                            {!isCompleted && (
                                                <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })} remaining</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
