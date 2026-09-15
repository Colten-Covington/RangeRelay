import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RangeRelay — Public launch telemetry, safely released", template: "%s · RangeRelay" },
  description: "A provider-controlled release gateway and neutral public API for launch telemetry.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "RangeRelay",
    description: "One controlled telemetry release. Every public experience.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071018",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
