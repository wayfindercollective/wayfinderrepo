// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./app/components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        citv: {
          black: "#000000",
          ink: "#1B1B1B",         // secondary panels
          white: "#FFFFFF",
          cyan:  "#00FFFF",       // signal glow
          magenta: "#FF00FF",     // controlled chaos
          orange: "#FA6400",      // friction / warning
          acid: "#7FFF00",        // optional highlight
          // background blues for bands/panels
          deep: "#0A0F1A",        // very dark blue
          navy: "#0B1324",
        },
      },
      boxShadow: {
        // subtle neon glows
        "cyan-md": "0 0 20px rgba(0,255,255,0.25)",
        "cyan-lg": "0 0 40px rgba(0,255,255,0.35)",
        "magenta-md": "0 0 24px rgba(255,0,255,0.25)",
        "panel": "0 24px 60px -20px rgba(11,19,36,0.55)",
      },
      dropShadow: {
        neon: ["0 0 10px rgba(0,255,255,0.45)"],
      },
      gradientColorStops: {
        // not strictly required; handy for class-based gradients
      },
    },
  },
  plugins: [],
} satisfies Config;
