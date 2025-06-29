import { User, Search, Share, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    step: "1",
    title: "سجل حسابك",
    description: "أنشئ حساباً مجانياً واحصل على وصول فوري لكتالوج منتجاتنا",
    icon: User,
  },
  {
    step: "2",
    title: "اختر منتجاتك",
    description: "تصفح منتجاتنا واختر ما تريد تسويقه بأسعارنا الخاصة للمسوقين",
    icon: Search,
  },
  {
    step: "3",
    title: "حدد سعرك وسوّق",
    description:
      "ضع السعر الذي تريده وشارك المنتجات مع أصدقائك أو على وسائل التواصل",
    icon: Share,
  },
  {
    step: "4",
    title: "أرسل الطلبات واربح",
    description:
      "عند وجود زبون، أرسل لنا الطلب وستحصل على ربحك فور إتمام البيع",
    icon: DollarSign,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-background to-secondary/20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            كيف تبدأ التسويق معنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            أربع خطوات بسيطة لتصبح مسوقاً ناجحاً وتحقق أرباحاً ممتازة
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
