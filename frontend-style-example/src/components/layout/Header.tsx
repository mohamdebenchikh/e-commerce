import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { href: "#home", label: "الرئيسية" },
    { href: "#products", label: "المنتجات" },
    { href: "#how-it-works", label: "كيف يعمل" },
    { href: "#about", label: "من نحن" },
    { href: "#contact", label: "اتصل بنا" },
    { href: "#testimonials", label: "الشهادات" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              سوق المغرب
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-reverse space-x-4">
            <Link to="/signin">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <User className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="moroccan-gradient text-white border-0"
              >
                انضم الآن
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="justify-start">
                  <User className="ml-2 h-4 w-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
