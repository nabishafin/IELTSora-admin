import animate from "tailwindcss-animate";

/*
 * Design tokens modelled on the Astryx "Neutral" theme (astryx.atmeta.com):
 * Figtree type, #F1F1F1 page background with white surfaces, near-black accent,
 * soft 1px borders and a small radius scale (square cards with lightly rounded corners).
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1440px" } },
    extend: {
      fontFamily: { sans: ["Figtree", "system-ui", "sans-serif"], mono: ["SF Mono", "ui-monospace", "monospace"] },
      colors: {
        border: "#E3E3E3",
        input: "#D4D4D4",
        ring: "#1B1B1B",
        background: "#F1F1F1",
        foreground: "#1B1B1B",
        ink: "#1B1B1B",
        subtle: "#F5F5F5",
        muted: { DEFAULT: "#F5F5F5", foreground: "#474747" },
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
      borderRadius: { none: "0", sm: "3px", DEFAULT: "4px", md: "5px", lg: "6px", xl: "8px", "2xl": "10px", "3xl": "12px" },
      fontSize: { xs: ["12.5px", "18px"], sm: ["14.5px", "21px"] },
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
