// app/fonts.ts
import { Inter, Orbitron, IBM_Plex_Mono, Manrope, Exo_2, JetBrains_Mono, Urbanist, Michroma, Space_Mono } from "next/font/google";

// Set A — default
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400","600","700"],
});

export const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["600","700"],
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["500","600"],
});

// Set B — Manrope + Exo 2 + JetBrains Mono
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontB-body",
  weight: ["400","600","700"],
});
export const exo2 = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontB-display",
  weight: ["600","700"],
});
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontB-mono",
  weight: ["500","600"],
});

// Set C — Urbanist + Michroma + Space Mono
export const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontC-body",
  weight: ["400","600","700"],
});
export const michroma = Michroma({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontC-display",
  weight: ["400"], // single weight family
});
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--fontC-mono",
  weight: ["400","700"],
});
