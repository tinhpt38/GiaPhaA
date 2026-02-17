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
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
};

import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/providers/query-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${geistMono.variable} font-sans antialiased`}>
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
