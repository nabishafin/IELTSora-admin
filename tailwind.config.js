import animate from "tailwindcss-animate";

/*
 * Design tokens modelled on the Astryx "Neutral" theme (astryx.atmeta.com):
 * Figtree type, #F1F1F1 page background with white surfaces, near-black accent,
 * soft 1px borders and a 8 / 12 / 16px radius scale (inner / element / container).
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      fontFamily: { sans: ["Figtree", "system-ui", "sans-serif"], mono: ["SF Mono", "ui-monospace", "monospace"] },
      colors: {
        border: "#E6E6E6",
        input: "#D4D4D4",
        ring: "#1B1B1B",
        background: "#F1F1F1",
        foreground: "#1B1B1B",
        ink: "#1B1B1B",
        subtle: "#F5F5F5",
        muted: { DEFAULT: "#F5F5F5", foreground: "#5C5C5C" },
        primary: { DEFAULT: "#1B1B1B", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F1F1F1", foreground: "#1B1B1B" },
        accent: { DEFAULT: "#EDEDED", foreground: "#1B1B1B" },
        destructive: { DEFAULT: "#C9303A", foreground: "#FFFFFF" },
        success: "#198100",
        info: "#0074E2",
        warning: "#FFCE2F",
        popover: { DEFAULT: "#FFFFFF", foreground: "#1B1B1B" },
        card: { DEFAULT: "#FFFFFF", foreground: "#1B1B1B" },
      },
      borderRadius: { none: "0", sm: "6px", DEFAULT: "8px", md: "8px", lg: "12px", xl: "16px", "2xl": "20px", "3xl": "32px" },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        low: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        med: "0 6px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        high: "0 16px 40px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.06)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { "fade-in": "fade-in .25s ease-out" },
    },
  },
  plugins: [animate],
};
