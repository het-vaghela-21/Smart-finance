"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { usePathname } from "next/navigation";

export type BackgroundTheme = 'neon' | 'ocean' | 'matrix' | 'cosmic';

export function DashboardBackground() {
    const pathname = usePathname();

    // Determine theme based on path
    let theme: BackgroundTheme = 'neon';
    if (pathname.includes('/charts')) theme = 'ocean';
    else if (pathname.includes('/transactions')) theme = 'matrix';
    else if (pathname.includes('/ai-suggestions')) theme = 'cosmic';

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const getThemeConfig = () => {
        switch (theme) {
            case 'ocean':
                return {
                    color: "#0ea5e9", // Sky blue
                    shape: "triangle",
                    moveSpeed: 0.8,
                    linksOpacity: 0.2,
                    hoverMode: "repulse",
                    glowClass: "bg-[#0ea5e9]/5",
                };
            case 'matrix':
                return {
                    color: "#22c55e", // Green
                    shape: "edge", // Square-ish
                    moveSpeed: 1,
                    linksOpacity: 0.05, // Almost invisible links
                    hoverMode: "grab",
                    glowClass: "bg-[#22c55e]/5",
                    direction: "bottom",
                };
            case 'cosmic':
                return {
                    color: "#d946ef", // Fuchsia
                    shape: "star",
                    moveSpeed: 0.3, // Slow float
                    linksOpacity: 0.15,
                    hoverMode: "bubble",
                    glowClass: "bg-[#d946ef]/5",
                };
            case 'neon':
            default:
                return {
                    color: "#f97316", // Orange
                    shape: "circle",
                    moveSpeed: 0.5,
                    linksOpacity: 0.15,
                    hoverMode: "grab",
                    glowClass: "bg-[#f97316]/5",
                };
        }
    };

    const config = getThemeConfig();

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none">
            <Particles
                id={`dashboard-tsparticles-${theme}`} // Unique ID so it re-renders cleanly
                init={particlesInit}
                options={{
                    fullScreen: { enable: false, zIndex: -10 },
                    background: { color: { value: "transparent" } },
                    fpsLimit: 60,
                    interactivity: {
                        detectsOn: "window",
                        events: {
                            onHover: { enable: true, mode: config.hoverMode },
                        },
                        modes: {
                            grab: { distance: 150, links: { opacity: 0.3 } },
                            repulse: { distance: 100, duration: 0.4 },
                            bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
                        },
                    },
                    particles: {
                        color: { value: config.color },
                        links: {
                            color: config.color,
                            distance: 150,
                            enable: true,
                            opacity: config.linksOpacity,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            random: true,
                            speed: config.moveSpeed,
                            straight: false,
                            direction: (config as any).direction || "none",
                        },
                        number: { density: { enable: true, area: 1000 }, value: 40 },
                        opacity: { value: 0.3 },
                        shape: { type: config.shape },
                        size: { value: { min: 1, max: 3 } },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            />
            {/* Very faint background ambient glow matching the theme */}
            <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] ${config.glowClass} rounded-full blur-[120px] pointer-events-none transition-colors duration-1000`} />
            <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[60%] ${config.glowClass} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 delay-500`} />
        </div>
    );
}
