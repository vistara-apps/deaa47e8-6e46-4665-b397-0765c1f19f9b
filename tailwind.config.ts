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
        cardinal: "hsl(324, 93%, 48%)",
        accent: "hsl(204, 96%, 65%)",
        bg: "hsl(204, 100%, 97%)",
        surface: "hsl(0, 0%, 100%)",
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 4px 12px hsla(0, 0%, 0%, 0.1)",
      },
      transitionDuration: {
        fast: "100ms",
        base: "200ms",
      },
      transitionTimingFunction: {
        "ease-in-out": "ease-in-out",
      },
      maxWidth: {
        container: "28rem", // max-w-md equivalent
      },
      gap: {
        content: "1.5rem", // 24px gutter
      },
    },
  },
  plugins: [],
};

export default config;

