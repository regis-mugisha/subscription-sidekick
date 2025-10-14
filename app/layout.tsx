import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubBuddy",
  description:
    "Track and manage your subscriptions and never miss a payment or forget about an unused subscription again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
