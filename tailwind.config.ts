import type { Config } from "tailwindcss";

/**
 * Design tokens — dark-first premium identity (Linear/Vercel-inspired), adapted from
 * the platform's Premium Frontend Redesign spec (2026-08-13). The discipline that makes
 * it read as "serious infrastructure": one accent (amber) used ONLY on interactive
 * elements + status-ready dots, 1px hairline borders instead of shadows, tight radii.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black surfaces
        bg: "#0a0a0b",
        surface: "#111113", // card layer 1
        raised: "#141416", // card layer 2 (hover/raised)
        // Hairline / border ladder
        line: {
          DEFAULT: "#27272a",
          soft: "#1c1c1f",
          strong: "#3f3f46",
        },
        // Text
        fg: "#f4f4f5",
        "fg-2": "#a1a1aa",
        "fg-3": "#71717a",
        // The single accent — amber. Interactive elements + status-ready only.
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#fbbf24",
          fg: "#1c1917", // foreground on accent
        },
        // Status: ready = amber (dot+glow); off = neutral gray; attention = red family.
        status: {
          off: "#52525b",
          attention: "#f87171",
          "attention-dim": "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        column: "72rem",
      },
      borderRadius: {
        card: "0.875rem", // 14px cards/panels
        control: "0.5rem", // 8px controls
      },
      transitionTimingFunction: {
        // One shared curve for anything that moves distance (lift/slide).
        move: "cubic-bezier(.2,.8,.2,1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "220ms",
        slow: "380ms",
      },
      boxShadow: {
        // Amber "ready" glow — the one place a soft glow is allowed.
        glow: "0 0 0 3px rgba(245,158,11,0.14)",
        "glow-sm": "0 0 8px 0 rgba(245,158,11,0.55)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
