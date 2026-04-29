import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabNav } from "@/components/layout/NavLinks";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Belajarpedia — Direktori Sekolah, Universitas, dan Kursus di Indonesia",
    template: "%s | Belajarpedia",
  },
  description:
    "Belajarpedia membantu Anda menemukan sekolah, universitas, dan kursus di seluruh Indonesia. Bandingkan biaya, kurikulum, dan lokasi dengan mudah.",
  applicationName: "Belajarpedia",
  authors: [{ name: "Timedoor" }],
  creator: "Timedoor",
  publisher: "Belajarpedia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <MobileTabNav />
      </body>
    </html>
  );
}
