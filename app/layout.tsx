import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./../styles/brand-theme.css";
import { Inter, Orbitron, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
        className={`${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
