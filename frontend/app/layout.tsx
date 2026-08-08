import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "EZC POS",
  description: "EZECHIKECHI GLOBAL ENTERPRISE Point of Sale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Sidebar />

        <div className="min-h-screen md:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}