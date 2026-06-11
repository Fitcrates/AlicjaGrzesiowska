import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { SanityLive } from "@/sanity/lib/live";
import { isSanityPreviewRequest } from "@/sanity/preview";
import { defaultLocale } from "@/lib/i18n";
import VisualEditingWrapper from "@/components/VisualEditingWrapper";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Alicja - Information Architecture",
  description: "I help organizations remember and define what they know.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isPreview = await isSanityPreviewRequest();

  return (
    <html lang={defaultLocale} className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <SanityLive includeDrafts={isPreview} />
        <VisualEditingWrapper />
      </body>
    </html>
  );
}
