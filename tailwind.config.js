/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F3EE",
        cream: "#EFE8DF",
        sand: "#D9CFC3",
        mist: "#C8BDB0",
        stone: "#8A8178",
        ink: "#2C2622",
        charcoal: "#1A1614",
        gold: "#B8956A",
        "gold-soft": "#C4A484",
        rose: "#C9A08A",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.28em",
        nav: "0.16em",
      },
      boxShadow: {
        whisper: "0 1px 0 rgba(26, 22, 20, 0.06)",
        lift: "0 18px 40px -28px rgba(26, 22, 20, 0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      maxWidth: {
        page: "1440px",
      },
    },
  },
  plugins: [],
};
