import type { Metadata } from "next";
import "./globals.css";
import "./../styles/brand-theme.css";
import { inter, orbitron, plexMono } from "./fonts";

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
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
