import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gia Phả Việt - Gìn giữ nguồn cội, kết nối tương lai",
  description: "Nền tảng hiện đại giúp bạn tạo lập, lưu trữ và chia sẻ phả hệ gia đình một cách trân trọng và chuyên nghiệp nhất",
  icons: {
    icon: "/logo_v2.png",
    apple: "/logo_v2.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/providers/query-provider"
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${geistMono.variable} font-sans antialiased`}>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
