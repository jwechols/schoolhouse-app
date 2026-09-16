import type { Metadata } from "next";
import Script from "next/script";
import RefTaggerRescan from "@/components/RefTaggerRescan";
import VersionGate from "@/components/VersionGate";
import StationReporter from "@/components/StationReporter";
import CurriculumProvider from "@/components/CurriculumProvider";
import { fetchOverrides } from "@/lib/curriculum-overrides-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schoolhouse",
  description: "The Echols family learning app.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Briana's lesson overrides, seeded into the merge cache before the kid
  // components render (see CurriculumProvider). Empty when Supabase is unset.
  const overrides = await fetchOverrides();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts, Luckiest Guy (sign artifact only) + Cormorant Garamond (scripture) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7DC842" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Schoolhouse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Faithlife RefTagger, Scripture hover tooltips (ESV), app-wide */}
        <Script
          id="reftagger-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.refTagger = { settings: { bibleVersion: "ESV", roundCorners: true, socialSharing: [] } };`,
          }}
        />
        <Script
          src="https://api.reftagger.com/v2/RefTagger.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-parchment text-navy">
        <VersionGate />
        <RefTaggerRescan />
        <CurriculumProvider initial={overrides}>{children}</CurriculumProvider>
        <StationReporter />
      </body>
    </html>
  );
}
