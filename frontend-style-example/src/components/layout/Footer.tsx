import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">سوق المغرب</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              شركة مغربية متخصصة في توفير منتجات عالية الجودة للمسوقين بأسعار
              الجملة مع ضمان التوصيل لجميع المدن المغربية. شريكك في النجاح
              التجاري.
            </p>
            <div className="flex space-x-reverse space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
            <div className="space-y-3">
              {["الرئيسية", "من نحن", "كيف يعمل", "الشهادات", "اتصل بنا"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-300 hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">خدماتنا</h4>
            <div className="space-y-3">
              {[
                "منتجات بأسعار الجملة",
                "توصيل شامل",
                "دعم المسوقين",
                "إدارة الطلبات",
                "تدريب وإرشاد",
              ].map((service) => (
                <a
                  key={service}
                  href="#"
                  className="block text-gray-300 hover:text-primary transition-colors"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">معلومات التواصل</h4>
            <div className="space-y-3 text-gray-300">
              <p>info@soukmaroc.ma</p>
              <p>support@soukmaroc.ma</p>
              <p>+212 5XX-XXXXXX</p>
              <p>+212 6XX-XXXXXX</p>
              <p>الدار البيضاء، المغرب</p>
              <p>الرباط، المغرب</p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4">
              اشترك في نشرتنا الإخبارية
            </h4>
            <p className="text-gray-300 mb-6">
              احصل على آخر الأخبار والعروض الحصرية
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="بريدك الإلكتروني"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="moroccan-gradient text-white border-0 px-6">
                اشترك
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 md:mb-0">
              {[
                "شروط الخدمة",
                "سياسة الخصوصية",
                "سياسة الاسترداد",
                "الأسئلة الشائعة",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 سوق المغرب. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
