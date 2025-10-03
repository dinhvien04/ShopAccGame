import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopT1 - Shop Nick Game Uy Tín | Liên Quân, Free Fire, Blox Fruits",
  description: "ShopT1.com - Shop bán nick game uy tín, giá rẻ. Chuyên nick Liên Quân Mobile, Free Fire, Blox Fruits, ĐTCL, Valorant. Giao dịch nhanh chóng, bảo mật 100%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
