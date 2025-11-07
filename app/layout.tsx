import type { Metadata } from "next";
import "./globals.css";
import "./../styles/brand-theme.css";
import { manrope, exo2, jetbrains } from "./fonts";
import Starfield from "./components/Starfield";

export const metadata: Metadata = {
  title: "Void Underground - Charisma Coaching Program",
  description: "Join Void Underground - A 12-month community-driven program to transform your charisma through missions, tasks, and action. $297 value for $1200 of content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${exo2.variable} ${jetbrains.variable}`}>
      <body className="antialiased relative">
        <Starfield />
        {children}
      </body>
    </html>
  );
}
