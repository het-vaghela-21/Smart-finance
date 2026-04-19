import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Quantexa brand palette
        "qx-bg":        "#05050F",
        "qx-surface":   "#0D0D1A",
        "qx-surface-2": "#12102A",
        "qx-violet":    "#7C3AED",
        "qx-violet-lt": "#9F67FF",
        "qx-cyan":      "#22D3EE",
        "qx-cyan-lt":   "#67E8F9",
      },
      animation: {
        marquee:     "marquee 32s linear infinite",
        floatNode:   "floatNode 5s ease-in-out infinite",
        drawLine:    "drawLine 8s ease-in-out infinite",
        auroraShift: "auroraShift 18s ease-in-out infinite",
        bounceDown:  "bounceDown 1.6s ease-in-out infinite",
        fadeSlideUp: "fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        pulseRing:   "pulseRing 2s ease-out infinite",
        slowSpin:    "slowSpin 20s linear infinite",
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
};
export default config;

