import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avero — AI Website Builder",
  description: "Describe your website. Watch Avero build it in seconds. Edit through chat, preview live, publish in one click.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-app-bg text-app-text">{children}</body>
    </html>
  );
}
