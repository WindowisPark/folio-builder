import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "My Folio Builder - 나만의 포트폴리오를 만들어보세요",
  description: "개발자, 디자이너를 위한 포트폴리오 빌더. 프로젝트 쇼케이스, 이력서, Case Study를 한 곳에서 관리하고 공유하세요.",
  keywords: ["포트폴리오", "이력서", "개발자 포트폴리오", "디자이너 포트폴리오", "portfolio builder"],
  authors: [{ name: "My Folio Builder" }],
  openGraph: {
    title: "My Folio Builder",
    description: "나만의 포트폴리오를 만들어보세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
