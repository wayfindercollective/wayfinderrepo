import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./../styles/brand-theme.css";
import { Inter, Orbitron, IBM_Plex_Mono } from "next/font/google";
import Starfield from './components/Starfield';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap", weight: ["400", "500", "600", "700"] });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--f-orbitron", display: "swap", weight: ["400", "500", "600", "700", "900"] });
const plex = IBM_Plex_Mono({ subsets: ["latin"], variable: "--f-plex", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Void Underground - Charisma Coaching Program",
  description: "Join Void Underground - A 6-month community-driven program to transform your charisma through missions, tasks, and action. $297 value for $600 of content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${plex.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Starfield />
        {children}
      </body>
    </html>
  );
}
