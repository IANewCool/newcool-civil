import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derecho Civil Chile | NewCooltura Informada",
  description: "Derecho civil, calculadora de intereses, plazos procesales y costas judiciales en Chile",
  keywords: ["derecho civil", "intereses legales", "plazos procesales", "costas judiciales", "juicios civiles"],
  openGraph: {
    title: "Derecho Civil Chile - NewCooltura Informada",
    description: "Calculadora de intereses y plazos procesales",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
