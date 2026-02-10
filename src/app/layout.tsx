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
  FooterWrapper,
  Preloader,
  ScrollToTop,
  ScrollBar,
  GlobalCTA,
} from "@/components/layout";
import { getCTASection, getSiteSettings, getNavigationItems } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.name ? `${settings.name} - ${settings.tagline || 'Property Agent'}` : "4best - Property Agent",
    description: settings?.tagline || "Your trusted property agent partner for finding the perfect home",
    icons: {
      icon: [
        { url: settings?.favicon || "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.png", type: "image/png" },
      ],
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data from database
  const ctaData = await getCTASection();
  const siteSettings = await getSiteSettings();
  const navItems = await getNavigationItems({ activeOnly: true });

  // Transform navigation items for Header component
  const navigationItems = navItems.map(item => ({
    id: item.id,
    label: item.label,
    href: item.href,
    display_order: item.display_order,
  }));

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
          <Header 
            navigationItems={navigationItems}
            logo={siteSettings?.logo || undefined}
          />
          <main>{children}</main>
          <GlobalCTA
            subtitle={ctaData?.subtitle || undefined}
            title={ctaData?.title || undefined}
            description={ctaData?.description || undefined}
            primaryButtonText={ctaData?.primary_button_text || undefined}
            primaryButtonHref={ctaData?.primary_button_href || undefined}
            secondaryButtonText={ctaData?.secondary_button_text || undefined}
            secondaryButtonHref={ctaData?.secondary_button_href || undefined}
            backgroundImage={ctaData?.background_image || undefined}
          />
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
        </div>
      </body>
    </html>
  );
}
