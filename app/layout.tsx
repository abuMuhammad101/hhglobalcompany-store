import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hhglobalcompany.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HH Global Company — Precision Garments & Full-Grain Leather, Made to Order",
    template: "%s | HH Global Company",
  },
  description:
    "Wholesale garments and full-grain leather goods, manufactured to your exact quantity, fabric and finish. Request a custom quote — replies within 24 hours.",
  openGraph: {
    title: "HH Global Company — Precision Garments & Full-Grain Leather",
    description:
      "Wholesale garments and full-grain leather goods, manufactured to your exact quantity, fabric and finish.",
    url: siteUrl,
    siteName: "HH Global Company",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${spaceMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          // Organization schema — this is part of what makes the site legible to LLM answer engines,
          // not just search crawlers.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HH Global Company",
              url: siteUrl,
              description:
                "Wholesale manufacturer of garments and full-grain leather goods, offering custom quotes on request.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Karachi",
                addressCountry: "PK",
              },
            }),
          }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
