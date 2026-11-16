import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Libre_Baskerville } from "next/font/google";
import "@/app/globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { SiteChrome } from "@/components/site-chrome";
import { ToastProvider } from "@/components/toast-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mpampe.com";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
});

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
  themeColor: "#ff5528",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${dmSans.variable} ${caveat.variable} ${libreBaskerville.variable} custom-cursor`}
        suppressHydrationWarning
      >
        <MotionProvider />
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
