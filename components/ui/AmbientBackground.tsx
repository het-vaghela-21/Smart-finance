"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { motion } from "framer-motion";

export function AmbientBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        // Loads the slim version of tsparticles which contains the basics
        await loadSlim(engine);
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-0">
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={{
                        fullScreen: { enable: false, zIndex: 0 },
                        background: {
                            color: {
                                value: "transparent",
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            detectsOn: "window",
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                resize: true,
                            },
                            modes: {
                                repulse: {
                                    distance: 120,
                                    duration: 0.4,
                                },
                                push: {
                                    quantity: 4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#f97316", // Neon Orange
                            },
                            links: {
                                color: "#f97316",
                                distance: 150,
                                enable: true,
                                opacity: 0.6,
                                width: 2,
                            },
                            move: {
                                enable: true,
                                random: true,
                                speed: 2,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 100,
                            },
                            opacity: {
                                value: 0.7,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 2, max: 6 },
                            },
                        },
                        detectRetina: true,
                    }}
                    className="absolute inset-0 w-full h-full"
                />
            </div>

            {/* Ambient Aurora Glows - Neon Orange / Deep Red */}
            <motion.div
                className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#f97316]/10 rounded-full blur-[120px] z-[-1] pointer-events-none"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="fixed top-[20%] right-[-5%] w-[40%] h-[60%] bg-[#ea580c]/10 rounded-full blur-[120px] z-[-1] pointer-events-none"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </>
    );
}
