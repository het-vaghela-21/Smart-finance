import { Zap } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden">
            {/* CSS-only ambient glow — avoids tsparticles duplicate ID conflict with home page */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed top-[20%] right-[-5%] w-[40%] h-[60%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-1/3 w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
            {/* Brand */}
            <Link href="/" className="absolute top-6 left-8 flex items-center gap-2 text-white font-bold text-xl tracking-tight z-20">
                <Zap className="w-6 h-6 text-orange-500" /> FinAI
            </Link>
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
