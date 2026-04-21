"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Loader2, KeyRound, Eye, EyeOff, X } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [popup, setPopup] = useState<{ name: string; password: string } | null>(null);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/users/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Something went wrong.");
            } else {
                setPopup({ name: data.name, password: data.password });
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            {/* ── Forgot Password Card ── */}
            <div className="w-full max-w-md">
                <div className="bg-surface-container-lowest rounded-3xl p-8 ambient-shadow border border-outline-variant/20">
                    <div className="mb-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-7 h-7 text-on-secondary-container" />
                        </div>
                        <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
                            Forgot Password
                        </h1>
                        <p className="text-on-surface-variant text-sm">
                            Enter your registered email &amp; phone to retrieve your password.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-error-container/20 border border-error/20 text-error text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Registered email address"
                                required
                                className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/70 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Registered phone number"
                                className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/70 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl glass-gradient text-on-primary font-semibold text-sm transition-all shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Retrieve My Password
                        </button>
                    </form>

                    <p className="text-center text-on-surface-variant text-sm mt-6">
                        Remember it?{" "}
                        <Link href="/auth/login" className="text-primary hover:text-primary-container font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* ── Password Popup Modal ── */}
            {popup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/80 backdrop-blur-sm px-4"
                    onClick={() => setPopup(null)}
                >
                    <div
                        className="relative w-full max-w-sm bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 ambient-shadow animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setPopup(null)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center mx-auto mb-5">
                            <KeyRound className="w-6 h-6 text-on-secondary-container" />
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-on-surface mb-1">Password Found!</h2>
                            <p className="text-on-surface-variant text-sm">
                                Hi <span className="text-primary font-medium">{popup.name || "there"}</span>, here is your password.
                            </p>
                        </div>

                        {/* Password display */}
                        <div className="relative">
                            <div className="w-full bg-surface border border-primary/30 rounded-xl px-4 py-3 text-on-surface font-mono text-sm tracking-wide pr-12 break-all">
                                {showPass ? popup.password : "•".repeat(popup.password.length)}
                            </div>
                            <button
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <p className="text-center text-on-surface-variant/70 text-xs mt-4">
                            Keep this safe. This popup will close when you click outside.
                        </p>

                        <Link
                            href="/auth/login"
                            onClick={() => setPopup(null)}
                            className="mt-5 w-full flex items-center justify-center py-3 rounded-xl glass-gradient text-on-primary font-semibold text-sm transition-all shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
                        >
                            Go to Sign In
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
