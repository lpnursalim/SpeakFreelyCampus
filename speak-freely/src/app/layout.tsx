// src/app/layout.tsx
import "./globals.css";
import { staatliches, poppins } from "@/lib/fonts";
 import Header from "@/components/Header/Header";
 import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Speak Freely | UGA",
  description: "Know your rights. Learn how to exercise them on campus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body id="top" className={`${staatliches.variable} ${poppins.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
