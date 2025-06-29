import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Moroccan Pattern Background */}
      <div className="fixed inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

      <Header />

      <main className="relative z-10">{children}</main>

      <Footer />
    </div>
  );
}
