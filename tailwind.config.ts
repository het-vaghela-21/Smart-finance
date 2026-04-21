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
        // Veridian Ledger brand palette
        "surface":                  "#effcf9",
        "surface-container-low":    "#e9f6f3",
        "surface-container-lowest": "#ffffff",
        "surface-variant":          "#d8e5e2",
        "on-surface":               "#121e1c",
        "on-surface-variant":       "#3c4a42",
        "primary":                  "#006c49",
        "primary-container":        "#10b981",
        "on-primary":               "#ffffff",
        "on-primary-container":     "#00422b",
        "error":                    "#ba1a1a",
        "error-container":          "#ffdad6",
        "outline":                  "#6c7a71",
        "outline-variant":          "#bbcabf"
      },
      boxShadow: {
        'ambient': '0 20px 40px -10px rgba(6, 78, 59, 0.06)',
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
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

