import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groundlink - Connecting ground reality to intelligent action",
  description:
    "AI-powered dashboard for NGOs to convert field reports into actionable insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
