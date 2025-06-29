import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-background to-secondary/20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            تواصل معنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            هل لديك أسئلة حول المنتجات أو التسويق؟ فريقنا مستعد لمساعدتك
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="shadow-moroccan">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">
                أرسل لنا رسالة
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <Input
                    placeholder="أدخل اسمك الكامل"
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الهاتف
                  </label>
                  <Input placeholder="أدخل رقم هاتفك" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الرسالة
                  </label>
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className="text-right resize-none"
                  />
                </div>
                <Button className="w-full moroccan-gradient text-white border-0 py-3">
                  إرسال الرسالة
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary">
                معلومات التواصل
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">البريد الإلكتروني</p>
                    <p className="text-muted-foreground">info@soukmaroc.ma</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">رقم الهاتف</p>
                    <p className="text-muted-foreground">+212 5XX-XXXXXX</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">العنوان</p>
                    <p className="text-muted-foreground">
                      الدار البيضاء، المغرب
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">ساعات العمل</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>الاثنين - الجمعة</span>
                  <span className="text-muted-foreground">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>السبت</span>
                  <span className="text-muted-foreground">9:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>الأحد</span>
                  <span className="text-muted-foreground">مغلق</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
