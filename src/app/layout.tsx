import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { generateMetadata as generateCustomMetadata } from "./metadata";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = generateCustomMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Neekson Shrestha",
    "url": "https://neeksonshrestha.com.np",
    "jobTitle": "Creative Technologist",
    "sameAs": [
      "https://github.com/Selkie-the-goat",
      "https://linkedin.com/in/neekson-shrestha"
    ]
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-jetbrains-mono bg-obsidian text-pure-white antialiased terminal-flicker`}
      >
        <div className="fixed inset-0 pointer-events-none bg-[url('/noise.png')] opacity-[0.03] z-50"></div>
        <div className="scanline"></div>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
