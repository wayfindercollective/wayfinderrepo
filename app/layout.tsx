import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./../styles/brand-theme.css";
import { inter, orbitron, plexMono } from "./fonts";
import Starfield from "./components/Starfield";
import GlobalFlickerEffect from "./components/GlobalFlickerEffect";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Join the Void",
  description: "A Cyber-Monk Dojo for Real-World Charisma",
  metadataBase: new URL("https://thevoidunderground.com"),
  alternates: {
    canonical: "https://thevoidunderground.com",
  },
  openGraph: {
    title: "Join the Void",
    description: "A Cyber-Monk Dojo for Real-World Charisma",
    url: "https://thevoidunderground.com",
    siteName: "Void Underground",
    images: [
      {
        url: "/VU_LOGO_V2.png",
        width: 1200,
        height: 630,
        alt: "Void Underground Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Void",
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
        <Analytics />
      </body>
    </html>
  );
}
