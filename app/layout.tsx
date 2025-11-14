import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./../styles/brand-theme.css";
import { inter, orbitron, plexMono } from "./fonts";
import Starfield from "./components/Starfield";
import GlobalFlickerEffect from "./components/GlobalFlickerEffect";

export const metadata: Metadata = {
  title: "Void Underground - Charisma Coaching Program",
  description: "Join Void Underground - A 12-month community-driven program to transform your charisma through missions, tasks, and action. $297 value for $600 of content.",
  openGraph: {
    title: "Void Underground - Charisma Coaching Program",
    description: "A Cyber-Monk Dojo for Real-World Charisma",
    images: [
      {
        url: "/VU_LOGO_V2.png",
        width: 1200,
        height: 630,
        alt: "Void Underground Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Void Underground - Charisma Coaching Program",
    description: "A Cyber-Monk Dojo for Real-World Charisma",
    images: ["/VU_LOGO_V2.png"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${plexMono.variable}`}>
      <body className="antialiased relative">
        <GlobalFlickerEffect />
        <Starfield />
        {children}
      </body>
    </html>
  );
}
