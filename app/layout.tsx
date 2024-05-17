import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Logits",
  description: "A daily AI guessing game",
  openGraph: {
    title: "Daily Logits",
    description: "A daily AI guessing game! Can you guess what it's thinking???",
    images: "https://daily-logits.vercel.app/marketing.jpg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
