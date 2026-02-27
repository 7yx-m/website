import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Neekson Shrestha | Creative Technologist",
  description: "High-performance portfolio for Neekson Shrestha - Premium Developer IDE Experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${jetbrainsMono.variable} font-jetbrains-mono bg-obsidian text-pure-white antialiased`}
      >
        <div className="fixed inset-0 pointer-events-none bg-[url('/noise.png')] opacity-[0.03] z-50"></div>
        {children}
      </body>
    </html>
  );
}
