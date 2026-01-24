import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "MintMart | Collectible NFTs on Bitcoin",
  description: "Mint exclusive collectible NFTs on Stacks, the Bitcoin L2. Five rarity tiers, limited supply, secured by Bitcoin.",
  keywords: ["NFT", "Bitcoin", "Stacks", "Collectibles", "Minting", "Blockchain"],
  openGraph: {
    title: "MintMart | Collectible NFTs on Bitcoin",
    description: "Mint exclusive collectible NFTs on Stacks, the Bitcoin L2.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
