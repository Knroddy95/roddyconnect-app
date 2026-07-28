import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1E45",
        blue: {
          DEFAULT: "#1E5FBF",
          dark: "#123B7A",
          soft: "#E4EDFB",
        },
        orange: {
          DEFAULT: "#F2841C",
          soft: "#FDE8D2",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
