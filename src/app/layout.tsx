import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Template CSS imports - order matters (imported before globals to avoid Tailwind processing issues)
import "@/styles/template/bootstrap.min.css";
import "@/styles/template/plugins.css";
import "@/styles/template/swiper.css";
import "@/styles/template/style.css";
import "@/styles/template/coloring.css";
import "@/styles/template/scheme-01.css";

// Global styles (includes Tailwind)
import "./globals.css";

import {
  Header,
  Footer,
  Preloader,
  ScrollToTop,
  ScrollBar,
} from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4best - Property Agent",
  description:
    "Your trusted property agent partner for finding the perfect home",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- Font icon CSS files loaded via link tags since server-relative imports don't work in CSS */}
        <link
          rel="stylesheet"
          href="/fonts/fontawesome4/css/font-awesome.css"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fontawesome6/css/fontawesome.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fontawesome6/css/brands.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fontawesome6/css/solid.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/elegant_font/HTML_CSS/style.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/et-line-font/style.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/icofont/icofont.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div id="wrapper">
          <ScrollToTop />
          <ScrollBar />
          <Preloader />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
