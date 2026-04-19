"use client";

import { memo } from "react";

// Wrapped in memo so the entire background does NOT re-render when the route
// changes — it stays mounted and stable inside the dashboard layout.
export const DashboardBackground = memo(function DashboardBackground() {
    return (
        <div
            className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden"
            style={{ background: "linear-gradient(160deg, #05050F 0%, #0A0818 60%, #050510 100%)" }}
        >
            {/* Star field — pure CSS, zero JS */}
            <div
                className="absolute inset-0 opacity-[0.14]"
                style={{
                    backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.9) 0, rgba(255,255,255,0) 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Violet aurora — promoted to compositor layer via will-change */}
            <div
                className="absolute top-[-15%] left-[-8%] w-[55%] h-[55%] rounded-full blur-[130px]"
                style={{
                    background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
                    animation: "auroraShift 18s ease-in-out infinite",
                    willChange: "transform",
                }}
            />
            {/* Cyan aurora */}
            <div
                className="absolute top-[25%] right-[-12%] w-[45%] h-[55%] rounded-full blur-[140px]"
                style={{
                    background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
                    animation: "auroraShift 22s ease-in-out infinite reverse",
                    animationDelay: "3s",
                    willChange: "transform",
                }}
            />
            {/* Bottom violet accent */}
            <div
                className="absolute bottom-[-10%] left-[15%] w-[60%] h-[35%] rounded-full blur-[110px]"
                style={{
                    background: "radial-gradient(circle, rgba(99,38,200,0.13) 0%, transparent 70%)",
                    animation: "auroraShift 25s ease-in-out infinite",
                    animationDelay: "8s",
                    willChange: "transform",
                }}
            />

            {/* SVG node network — reduced to 4 nodes for perf */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden="true"
            >
                <line x1="200" y1="150" x2="500" y2="320" stroke="rgba(124,58,237,0.20)" strokeWidth="1"
                    strokeDasharray="400" style={{ animation: "drawLine 8s ease-in-out infinite" }} />
                <line x1="500" y1="320" x2="820" y2="200" stroke="rgba(34,211,238,0.18)" strokeWidth="1"
                    strokeDasharray="400" style={{ animation: "drawLine 10s ease-in-out infinite", animationDelay: "1s" }} />
                <line x1="820" y1="200" x2="1150" y2="380" stroke="rgba(124,58,237,0.18)" strokeWidth="1"
                    strokeDasharray="400" style={{ animation: "drawLine 12s ease-in-out infinite", animationDelay: "2s" }} />
                <line x1="500" y1="320" x2="680" y2="560" stroke="rgba(124,58,237,0.15)" strokeWidth="1"
                    strokeDasharray="400" style={{ animation: "drawLine 9s ease-in-out infinite", animationDelay: "1.5s" }} />

                {/* 4 nodes instead of 6-8 */}
                {[
                    { cx: 200, cy: 150, r: 4, color: "#7C3AED", delay: "0s" },
                    { cx: 500, cy: 320, r: 5, color: "#9F67FF", delay: "0.8s" },
                    { cx: 820, cy: 200, r: 5, color: "#22D3EE", delay: "1.4s" },
                    { cx: 1150, cy: 380, r: 4, color: "#7C3AED", delay: "0.4s" },
                ].map((node, i) => (
                    <g key={i} style={{ animation: `floatNode 6s ease-in-out infinite`, animationDelay: node.delay }}>
                        <circle cx={node.cx} cy={node.cy} r={node.r + 7} fill={node.color} opacity="0.07" />
                        <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.color} opacity="0.6" />
                        <circle cx={node.cx} cy={node.cy} r={node.r * 0.4} fill="white" opacity="0.5" />
                    </g>
                ))}

                {/* Single energy wave (was 2, now 1) */}
                <path
                    d="M0 500 Q360 380 720 500 Q1080 620 1440 480"
                    stroke="rgba(124,58,237,0.08)" strokeWidth="1.5" fill="none"
                    strokeDasharray="800"
                    style={{ animation: "drawLine 14s ease-in-out infinite" }}
                />
            </svg>

            {/* Dot-grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                }}
            />
        </div>
    );
});
