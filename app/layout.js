import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { categories } from "@/lib/data";
import HeaderClient from "@/components/HeaderClient";
import SiteFooter from "@/components/SiteFooter";
import SideMenu from "@/components/SideMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "البشاواتي",
  description: "حلويات طازجة يومياً",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="siteHeader">
          <div className="container headerInner">
            <SideMenu categories={categories} />

            <Link href="/" className="brandCenter">
              <img src="/logo.png" alt="البشاواتي" className="siteLogo" />
            </Link>

            <div className="headerRight">
              {/* HeaderClient will render LangToggle + cart button, and also sync html lang/dir */}
              <HeaderClient />
            </div>
          </div>
        </header>

        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
