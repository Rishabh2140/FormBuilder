import { Inter } from "next/font/google";
import Header from "./_components/Header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Form Builder - Innovation Cell, NIT Raipur",
  description: "Create intelligent forms with AI for clubs, committees, and events at NIT Raipur. Built by Innovation Cell.",
  keywords: "NIT Raipur, Form Builder, Innovation Cell, NITRR, Student Forms, Event Registration",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.webp" type="image/webp" />
        </head>
        <body className={inter.className}>
          <Header/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
