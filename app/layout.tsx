import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

// La nouvelle police Poppins (Moderne, Tech, Lisible)
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

// La police Serif pour les petits accents élégants en italique
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  style: ['italic'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "TechStratix | Accélérateur & Hub d'Investissement",
  description: "Plateforme d'accompagnement pour startups, mentors et investisseurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${poppins.variable} ${playfair.variable} font-sans bg-[#F8FAFC] text-[#101D42] antialiased`}>
        {children}
      </body>
    </html>
  );
}