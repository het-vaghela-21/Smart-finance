import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center bg-surface overflow-hidden">
            {/* Luminous orbs */}
            <div className="fixed top-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[130px] pointer-events-none bg-primary-container/20 animation-pulse" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[45%] h-[55%] rounded-full blur-[140px] pointer-events-none bg-secondary-container/20 animation-pulse" style={{ animationDelay: "2s" }} />

            {/* Brand mark */}
            <Link href="/" className="absolute top-6 left-8 flex items-center gap-2.5 text-on-surface font-bold text-xl tracking-tight z-20 hover:opacity-80 transition-opacity">
                Veridian Ledger
            </Link>
            
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
