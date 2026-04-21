"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, TrendingUp, Link as LinkIcon, PieChart, Quote, Loader2 } from "lucide-react";

const LandingVisualizer = dynamic(
    () => import("@/components/dashboard/LandingVisualizer").then(mod => mod.LandingVisualizer),
    { 
        ssr: false, 
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-low/50 animate-pulse rounded-xl">
                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
            </div>
        )
    }
);

export default function Home() {
    const [navScrolled, setNavScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setNavScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
            {/* Top Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all ${navScrolled ? "bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(6,78,59,0.06)]" : "bg-transparent"}`}>
                <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold tracking-tighter text-primary">Veridian Ledger</div>
                    {/* Web Navigation */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a className="text-on-surface opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300" href="#features">Features</a>
                        <Link className="text-on-surface opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300" href="/dashboard">Dashboard</Link>
                        <a className="text-on-surface opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300" href="#showcase">Interface</a>
                    </div>
                    <div className="flex items-center space-x-4 text-sm font-medium">
                        <Link className="text-on-surface opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300 hidden md:block" href="/auth/login">Log In</Link>
                        <Link className="glass-gradient text-on-primary px-5 py-2.5 rounded-md hover:shadow-lg transition-all duration-300 font-semibold" href="/auth/register">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 pb-20 overflow-hidden">
                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-8 lg:px-12 pt-12 lg:pt-24 pb-20 flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-container/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
                    <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8 z-10">
                        <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold tracking-wide uppercase shadow-sm">
                            The Luminous Ledger
                        </span>
                        <h1 className="text-5xl lg:text-[4rem] leading-[1.1] font-extrabold tracking-tight text-on-surface">
                            Master Your Wealth with <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--primary), var(--primary-container))" }}>Precision</span>
                        </h1>
                        <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
                            Elevate your personal finance experience with professional-grade tools. Veridian Ledger provides unparalleled clarity and control over your financial ecosystem.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                            <Link href="/auth/register" className="w-full sm:w-auto glass-gradient text-on-primary px-8 py-4 rounded-md text-base font-semibold transition-all duration-300 hover:-translate-y-1 shadow-ambient flex items-center justify-center">
                                Get Started for Free
                            </Link>
                            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-md text-primary font-semibold hover:bg-surface-variant/30 transition-all duration-300 flex items-center justify-center gap-2">
                                View Demo <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 pt-8 text-sm text-on-surface-variant">
                            <div className="flex -space-x-3">
                                <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW5sjaSWnDWXtyLhtx9ltDJ0wYLIOUXRukmK0pc_TSYG-_d6kPjzgV5i2vVneUTybJqpi4aFr5uIPdIf94SvJjPKONkbID-YqwetF7I-A9-tFaqlQwbO6_EtJWpxa98vdQ8NNrtyahbzSenlKxjtJNrFMD1O097oNxhF9ZShe4NhrPYUAthgRqJpygHLZwLKOO11jFe6z1-PzK97O_xNnRG_JxjxdRdaTi2UfoOEnJfaOqpG1O6kDjA4TviG8VHAEZw_IcqVbv7L0" />
                                <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmNq50IFKBJH8SPD8ctKQBk7oI471oqTQt9HDpRJ8Sd8pM6JKksj8eJzBcen5Cyc8cqcTECQVnoYNk_4ot5HG-qYk_GdNXZmHp_y7uCRbsrkU3qdzn_BLkoqoniWrmcHIFLATrqZJ7lWndM2G69Ya0D42QDrX4vLFIXdaFe6OaUZ3tC7HZQjeve8xfWx9QxplS5qJWHDkYYEZSEJ-1Fs1ZvorJ00V_dCwyMyQ_hObhPcW3ax-6Ih6aDko8ENORHn_fJvS0h0QB33M" />
                                <img alt="User 3" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6s2bVsMGVxVvW_BtpCUR8VArv5tpa8uxm5MTaGMr7hienXXvW_qtQbxj_LKOBCCqewqWo9YZOokNRJa8kAy4r-W6ipdaNBAMh3tpRg8d04axs1pN6jR4_S0-yqq0qC6Ce4uMJ5L3_b_xMGfNA3CFHpUPYd-0qpT6qou25nFJZuuYgUyJJm_jLeJqdbDVKAFKYuwcmQeUg6iNPYv-oiCh1duWTri5r2hgTdHLeCrHjP_lZ9-Q7f9tiyasgc3FAY5x6t-VMJam0jYU" />
                            </div>
                            <p>Trusted by <span className="font-bold text-on-surface">10,000+</span> individuals.</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden ambient-shadow bg-surface-container-low flex items-center justify-center border border-outline-variant/15 p-4">
                            {/* Abstract render */}
                            <img alt="Abstract Green Shapes" className="w-full h-full object-cover mix-blend-multiply opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC9wRH2lKLt6BOROMk0GCcJW8HMDa61Tp2a7R5twDJBD2uTQ7cK0fYu7aW61diALCMHiiyEYD5QbLPximKvMHHJ2EC55t-SZfckT_KLnWbCajpsQRA_lbmfrD_t03TE_RKCxNQD082pC595_iJx2UNReHOQ_eH4k9qlcmcXE5XMPqH0ifaQ3M81nI0_yDVfmBHGOCUA74f3HMRktxwrKQmc6rWWxWjBUvl1bOf__PfSUuJmO2FJqkSliqwwdSdIiKplDdDfcrvUYY" />
                            
                            <div className="absolute bottom-12 -left-8 bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/15 p-6 rounded-xl ambient-shadow w-64 animate-[bounce_4s_infinite]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                                            <TrendingUp className="text-primary w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Net Worth</p>
                                            <p className="font-bold text-on-surface">$1.24M</p>
                                        </div>
                                    </div>
                                    <span className="text-primary-container font-semibold text-sm">+2.4%</span>
                                </div>
                                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                                    <div className="h-full glass-gradient w-3/4 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3D Global Visualizer Break */}
                <section className="w-full relative overflow-hidden bg-surface-container-lowest/50 border-y border-outline-variant/10">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 -z-10 mix-blend-multiply opacity-50"></div>
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center pt-16 pb-8">
                        <div className="text-center z-10 pointer-events-none mb-[-80px] lg:mb-[-120px]">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Interactive Dimension</span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">The Neural Wealth Node</h2>
                        </div>
                        <LandingVisualizer />
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section id="features" className="py-24 bg-surface-container-low/50 relative">
                    <div className="max-w-7xl mx-auto px-8 lg:px-12">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-6">Designed for Financial Clarity</h2>
                            <p className="text-lg text-on-surface-variant">We&apos;ve distilled complex financial modeling into three core pillars, allowing you to manage your wealth with intuitive ease.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow border border-outline-variant/15 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mb-6">
                                    <TrendingUp className="text-on-secondary-container w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-4">Real-time Analytics</h3>
                                <p className="text-on-surface-variant text-base leading-relaxed mb-6 flex-grow">Watch your net worth evolve in real-time. Our dynamic charting engine visualizes trends before they become obvious.</p>
                                <a className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary-container transition-colors" href="/dashboard/charts">Explore Analytics <ArrowRight className="w-4 h-4" /></a>
                            </div>

                            <div className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow border border-outline-variant/15 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300 md:-translate-y-4">
                                <div className="w-14 h-14 rounded-full bg-[#b0f0d6] flex items-center justify-center mb-6">
                                    <LinkIcon className="text-[#002117] w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-4">Seamless Integration</h3>
                                <p className="text-on-surface-variant text-base leading-relaxed mb-6 flex-grow">Connect thousands of global institutions securely. Your entire financial portfolio, synchronized and synthesized in one place.</p>
                                <a className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary-container transition-colors" href="/dashboard">View Integrations <ArrowRight className="w-4 h-4" /></a>
                            </div>

                            <div className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow border border-outline-variant/15 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
                                    <PieChart className="text-primary w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-4">Intelligent Budgeting</h3>
                                <p className="text-on-surface-variant text-base leading-relaxed mb-6 flex-grow">Set targets that adapt to your lifestyle. Smart categorization learns your spending habits to automate your ledger.</p>
                                <a className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary-container transition-colors" href="/dashboard/goals">Discover Budgeting <ArrowRight className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Showcase Section (Screenshots) */}
                <section id="showcase" className="py-24 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#95d3ba]/20 rounded-full blur-[100px] -z-10"></div>
                    <div className="max-w-7xl mx-auto px-8 lg:px-12">
                        <div className="text-center mb-16">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Interface</span>
                            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-6">A Workspace, Not a Spreadsheet</h2>
                        </div>
                        <div className="relative w-full max-w-5xl mx-auto h-[500px] lg:h-[600px]">
                            {/* Dashboard Mockup (Back) */}
                            <div className="absolute top-0 right-0 w-[80%] h-full bg-surface-container-lowest rounded-2xl ambient-shadow border border-outline-variant/20 overflow-hidden transform rotate-2 origin-bottom-right opacity-60 blur-[1px] transition-all duration-500 hover:rotate-0 hover:opacity-100 hover:blur-0 hover:z-20">
                                <div className="h-16 bg-surface-container flex items-center px-6 border-b border-outline-variant/10">
                                    <div className="w-32 h-4 bg-surface-variant rounded-full"></div>
                                </div>
                                <div className="p-8 grid grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-6">
                                        <div className="h-48 bg-surface-container-low rounded-xl"></div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="h-32 bg-surface-container-low rounded-xl"></div>
                                            <div className="h-32 bg-surface-container-low rounded-xl"></div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 h-full bg-surface-container-low rounded-xl"></div>
                                </div>
                            </div>
                            {/* Accounts Mockup (Front) */}
                            <div className="absolute bottom-0 left-0 w-[80%] h-[90%] bg-surface-container-lowest rounded-2xl ambient-shadow border border-outline-variant/30 overflow-hidden transform -rotate-2 origin-bottom-left z-10 transition-all duration-500 hover:rotate-0 hover:z-30 hover:scale-[1.02]">
                                <div className="h-16 bg-surface-container flex items-center px-6 border-b border-outline-variant/10 justify-between">
                                    <div className="w-48 h-6 bg-surface-variant rounded-md"></div>
                                    <div className="w-24 h-8 bg-primary-container/20 rounded-md"></div>
                                </div>
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 bg-surface-container-low rounded-xl flex items-center px-6 gap-4">
                                            <div className="w-10 h-10 rounded-full bg-secondary-container"></div>
                                            <div className="space-y-2 flex-grow">
                                                <div className="h-4 w-32 bg-surface-variant rounded"></div>
                                                <div className="h-3 w-24 bg-surface-variant rounded"></div>
                                            </div>
                                            <div className="h-6 w-20 bg-surface-variant rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial */}
                <section className="py-24 bg-surface">
                    <div className="max-w-4xl mx-auto px-8 lg:px-12">
                        <div className="bg-surface-container-low rounded-2xl p-12 lg:p-16 text-center ambient-shadow relative overflow-hidden">
                            <Quote className="w-16 h-16 text-primary-container/20 absolute top-8 left-8" />
                            <p className="text-2xl lg:text-3xl font-medium text-on-surface leading-snug mb-10 relative z-10">
                                &quot;Veridian Ledger didn&apos;t just organize my finances; it elevated my entire perspective on wealth building. The interface feels less like an app and more like a private banking concierge.&quot;
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <img alt="Sarah Jenkins" className="w-14 h-14 rounded-full object-cover border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPwDD3VcqRpUnlnOLQup6IUrRLYNDmhhJrI8P5y5BjxBz98UUgd_kUrj7KsRPu2eXvPyQvSwY45qPxK-EjJUPKfT7LCrOrG4u04HJ4OemyGN4AXMMfINcpPae2fmyH5ivVkXVQ64kja2t-PKUJmyHWL8uS1rC2dYQIXXEzwMc3IFDCo9ZCozxk2OuF1_FLUPj9HQ245UEYIhRwh4Gfs-eJf7q-QUrdO3WKJt6YmF7wmBkuItPzgkhd4VQjtnnCdbV5HQe6d69DiVo" />
                                <div className="text-left">
                                    <p className="font-bold text-on-surface">Sarah Jenkins</p>
                                    <p className="text-sm text-on-surface-variant">Director of Operations, Horizon Tech</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="max-w-5xl mx-auto px-8 lg:px-12 relative z-10">
                        <div className="bg-on-surface text-surface rounded-3xl p-12 lg:p-20 text-center flex flex-col items-center justify-center ambient-shadow">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-surface">Ready to illuminate your ledger?</h2>
                            <p className="text-lg text-surface-variant max-w-2xl mx-auto mb-10 opacity-90">
                                Join thousands of professionals who have already upgraded their financial operating system. Sign up today and experience the clarity of Veridian Ledger.
                            </p>
                            <Link href="/auth/register" className="glass-gradient text-on-primary px-10 py-5 rounded-md text-lg font-bold hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                                Create Your Free Account
                            </Link>
                            <p className="mt-6 text-sm text-surface-variant opacity-70">No credit card required. 14-day free trial on premium features.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full pt-20 pb-10 bg-surface">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-primary/10 pt-10">
                    <div>
                        <div className="text-xl font-bold text-primary mb-4">Veridian Ledger</div>
                        <p className="text-sm leading-relaxed text-on-surface opacity-60 max-w-xs">
                            © {new Date().getFullYear()} Veridian Ledger. The Luminous Ledger for premium wealth management.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end text-sm leading-relaxed">
                        <a className="text-on-surface opacity-60 hover:opacity-100 hover:text-primary underline-offset-4 hover:underline ease-in-out duration-200" href="#">Privacy Policy</a>
                        <a className="text-on-surface opacity-60 hover:opacity-100 hover:text-primary underline-offset-4 hover:underline ease-in-out duration-200" href="#">Terms of Service</a>
                        <a className="text-on-surface opacity-60 hover:opacity-100 hover:text-primary underline-offset-4 hover:underline ease-in-out duration-200" href="#">Security Architecture</a>
                        <a className="text-on-surface opacity-60 hover:opacity-100 hover:text-primary underline-offset-4 hover:underline ease-in-out duration-200" href="#">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
