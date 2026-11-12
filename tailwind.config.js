import animate from "tailwindcss-animate";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], serif: ["Georgia", "serif"] },
      colors: {
        border: "#E5E5E5",
        input: "#E5E5E5",
        ring: "#111111",
        background: "#FFFFFF",
        foreground: "#111111",
        ink: "#111111",
        subtle: "#F7F7F7",
        muted: { DEFAULT: "#F7F7F7", foreground: "#737373" },
        primary: { DEFAULT: "#111111", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F7F7F7", foreground: "#111111" },
        accent: { DEFAULT: "#F2F2F2", foreground: "#111111" },
        destructive: { DEFAULT: "#B91C1C", foreground: "#FFFFFF" },
        success: "#15803D",
        popover: { DEFAULT: "#FFFFFF", foreground: "#111111" },
        card: { DEFAULT: "#FFFFFF", foreground: "#111111" },
      },
      borderRadius: { none: "0", sm: "0", DEFAULT: "0", md: "0", lg: "0", xl: "0", "2xl": "0", "3xl": "0" },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { "fade-in": "fade-in .25s ease-out" },
    },
  },
  plugins: [animate],
};
