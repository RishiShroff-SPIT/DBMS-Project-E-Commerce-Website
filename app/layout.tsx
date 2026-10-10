import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/store-context";
import { Navbar } from "@/components/navbar";
import { StoreDrawers } from "@/components/store-drawers";

export const metadata: Metadata = {
  title: "SwiftCart '26 — Express E-Commerce",
  description:
    "Interactive Express E-Commerce across Groceries, Fruits, Vegetables, Electronics, Clothes, Accessories, Dairy & Personal Care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <StoreProvider>
          <Navbar />
          {children}
          <StoreDrawers />
        </StoreProvider>
      </body>
    </html>
  );
}
