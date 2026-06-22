import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mpampe.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MpaMpe — Reach More. Raise More. Do More.",
    template: "%s | MpaMpe",
  },
  description:
    "A trusted community giving platform helping people and communities raise support, share verified stories and create measurable impact.",
  openGraph: {
    type: "website",
    locale: "en_UG",
    siteName: "MpaMpe",
    title: "MpaMpe — Reach More. Raise More. Do More.",
    description:
      "Discover trusted campaigns, support community needs and join the MpaMpe Mavericks volunteer community.",
    images: [{ url: "/images/hero.webp", width: 1200, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MpaMpe — Reach More. Raise More. Do More.",
    description: "Trusted community giving, built in Uganda.",
    images: ["/images/hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#286769",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
