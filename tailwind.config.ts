import type { Config } from "tailwindcss";

/**
 * Design tokens — taken from the Figma Make design (src/index.css @theme block).
 *
 * Two things in it do more work than anything else. The `paper` surface lets one
 * section invert to light, which breaks a long dark page into two acts. And hairlines
 * are drawn as `gap-px` over a `rule`-coloured parent rather than as borders, so a grid
 * of cards reads as one ruled object instead of a row of boxes.
 *
 * Orange stays reserved for interactive elements, status and the single emphasised
 * phrase per heading. The moment it decorates, it stops signalling.
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
        // Ink ladder — the dark ground and its two card layers
        bg: "#0D0D0D",
        surface: "#1A1A1A",
        raised: "#252525",
        // The light act
        paper: {
          DEFAULT: "#F7F6F4",
          2: "#EEEAE4",
          rule: "#D8D4CC",
        },
        // Hairlines
        line: {
          DEFAULT: "#2E2E2E",
          soft: "#2E2E2E",
          strong: "#6B6B6B",
        },
        // Text
        fg: "#F7F6F4",
        "fg-2": "#9B9B9B",
        "fg-3": "#6B6B6B",
        // The single accent
        accent: {
          DEFAULT: "#F5A623",
          hover: "#D8881A",
          fg: "#0D0D0D",
        },
        status: {
          off: "#3A3A3A",
          attention: "#f87171",
          "attention-dim": "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        column: "72rem",
      },
      borderRadius: {
        card: "0.75rem", // 12px panels — the Figma design's rounded-xl
        control: "0.375rem", // 6px controls — the Figma design's rounded-md
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
