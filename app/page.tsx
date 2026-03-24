import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Globe, Shield, Zap, Command, Layers, Box, Hexagon, Triangle, UserPlus, TrendingUp } from "lucide-react";

import { AmbientBackground } from "@/components/ui/AmbientBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent relative selection:bg-primary/30">
      <AmbientBackground />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel border-b-0 m-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <Zap className="w-6 h-6 text-primary" /> FinAI
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#home" className="hover:text-white transition-colors">Home</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#benefits" className="hover:text-white transition-colors">Benefits</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div>
          <Link href="/auth/login" className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-medium transition-all neon-hover-glow">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[90vh] relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8 neon-hover-glow">
          Investment Potential
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter max-w-4xl leading-[1.1] mb-6 drop-shadow-2xl">
          Empowering Your Investments with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">AI Technology</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Transform your wealth with AI-driven insights, OSINT market intelligence, and automated risk management—all from one highly-secure dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link href="/auth/register" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] flex items-center gap-2 w-full sm:w-auto justify-center">
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Trusted By / Logo Cloud */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-y border-white/5 bg-white/[0.02] relative z-10 my-8">
        <p className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-8">Trusted by innovative financial teams worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-xl font-bold text-white"><Command className="w-8 h-8" /> Quantum</div>
          <div className="flex items-center gap-2 text-xl font-bold text-white"><Layers className="w-8 h-8" /> Stacked</div>
          <div className="flex items-center gap-2 text-xl font-bold text-white"><Box className="w-8 h-8" /> Blockade</div>
          <div className="flex items-center gap-2 text-xl font-bold text-white"><Hexagon className="w-8 h-8" /> Nexus</div>
          <div className="flex items-center gap-2 text-xl font-bold text-white"><Triangle className="w-8 h-8" /> Apex</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Smarter Investing Starts Here</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Maximize Returns, Minimize Effort: A fully automated investment system that saves you time and worry.</p>
        </div>

        <div className="bento-grid">
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 col-span-12 md:col-span-12 lg:col-span-5 flex flex-col justify-between group neon-hover-glow hover:border-primary/30">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 mb-6 group-hover:bg-orange-500/20 transition-colors">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">OSINT Market Intel</h3>
              <p className="text-zinc-400">Leverage Open Source Intelligence to predict market shifts before they happen, aggregating millions of data points instantly.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between group neon-hover-glow hover:border-primary/30">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:border-primary/30 transition-colors">
              <BarChart3 className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Ledgers</h3>
              <p className="text-zinc-400">Automated portfolio rebalancing and hyper-accurate expense tracking powered by neural networks.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 col-span-12 md:col-span-6 lg:col-span-3 flex flex-col justify-between group neon-hover-glow hover:border-primary/30 bg-gradient-to-tr from-primary/5 to-transparent">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:border-primary/30 transition-colors">
              <Globe className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Global Assets</h3>
              <p className="text-zinc-400">Track equities and crypto seamlessly worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Highlights Section */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Real-time Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
              Actionable Intelligence at the Speed of Light
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We process massive amounts of open-source market data and social sentiment to deliver you real-time trading advantages. Never miss a breakout.
            </p>
            <ul className="space-y-4">
              {[
                "Millisecond trade execution API",
                "Dark pool tracking & volume analysis",
                "Automated risk & stop-loss adjustments"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="glass-panel p-2 rounded-2xl border border-white/10 neon-hover-glow relative">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
              {/* Mock Dashboard Visual */}
              <div className="bg-black/50 rounded-xl p-6 border border-white/5 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Live Data</div>
                </div>
                <div className="flex-1 border-b border-white/10 flex items-end justify-between pb-2 gap-2">
                  <div className="w-full bg-orange-500/80 rounded-t-sm h-[80%] hover:bg-orange-400 transition-colors"></div>
                  <div className="w-full bg-white/20 rounded-t-sm h-[40%] hover:bg-white/30 transition-colors"></div>
                  <div className="w-full bg-white/20 rounded-t-sm h-[60%] hover:bg-white/30 transition-colors"></div>
                  <div className="w-full bg-orange-500/80 rounded-t-sm h-[95%] hover:bg-orange-400 transition-colors"></div>
                  <div className="w-full bg-white/20 rounded-t-sm h-[30%] hover:bg-white/30 transition-colors"></div>
                  <div className="w-full bg-white/20 rounded-t-sm h-[70%] hover:bg-white/30 transition-colors"></div>
                  <div className="w-full bg-orange-500/80 rounded-t-sm h-[85%] hover:bg-orange-400 transition-colors"></div>
                </div>
                <div className="pt-4 flex justify-between text-xs font-semibold text-zinc-500">
                  <span>MARKET SURGE DETECTED</span>
                  <span className="text-orange-400">EXECUTING...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Automate Your Wealth in 3 Steps</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">From account creation to first executed trade in under 5 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-y-1/2 z-0"></div>

          {[
            { step: "01", title: "Connect Accounts", desc: "Securely link your brokerages and crypto wallets using our shielded API gateways.", icon: UserPlus },
            { step: "02", title: "Set Parameters", desc: "Define your risk tolerance and let our AI build your ideal asset allocation strategy.", icon: Zap },
            { step: "03", title: "Activate Autopilot", desc: "FinAI continuously monitors markets and rebalances automatically to lock in profits.", icon: TrendingUp }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 relative z-10 flex flex-col items-center text-center neon-hover-glow hover:-translate-y-2 transition-transform duration-300 bg-black/80">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-shadow">
                <item.icon className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-orange-500 font-bold text-xl mb-2 font-mono tracking-wider">{item.step}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Trusted by Elite Investors</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">See how financial professionals are transforming their portfolios.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "FinAI completely revolutionized how I manage my clients' offshore accounts. The OSINT intel is bordering on precognitive.",
              name: "Sarah Jenkins",
              role: "Hedge Fund Manager"
            },
            {
              quote: "The automated rebalancing saves me 15 hours a week. It literally pays for itself inside the first day of every month.",
              name: "Marcus Thorne",
              role: "Day Trader"
            },
            {
              quote: "I've never seen a platform synthesize global events into actionable trading data this quickly. Best UI in the game too.",
              name: "Elena Rodriguez",
              role: "Crypto Analyst"
            }
          ].map((testimonial, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 neon-hover-glow flex flex-col justify-between">
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map(star => <div key={star} className="text-orange-500">★</div>)}
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed mb-8 flex-1">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400"></div>
                <div>
                  <div className="text-white font-bold">{testimonial.name}</div>
                  <div className="text-zinc-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative z-10 text-center">
        <div className="glass-panel p-12 rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent neon-hover-glow">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Ready to Scale Your Wealth?</h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">Join thousands of investors using FinAI to automate their portfolio growth and reduce risk.</p>
          <Link href="/auth/register" className="px-8 py-4 inline-flex items-center justify-center rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
