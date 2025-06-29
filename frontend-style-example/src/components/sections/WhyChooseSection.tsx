import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "أسعار جملة حصرية",
    description:
      "احصل على منتجات عالية الجودة بأسعار الجملة شاملة التوصيل، وحدد سعر البيع بحرية كاملة.",
    icon: "💸",
  },
  {
    title: "نتكفل بالتوصيل",
    description:
      "لا تقلق بشأن الشحن أو التوصيل، نحن نتولى توصيل طلباتك لجميع المدن المغربية.",
    icon: "🚚",
  },
  {
    title: "أرباح بلا حدود",
    description:
      "كلما زاد الفرق بين سعر الشراء وسعر البيع، زاد ربحك. لا توجد حدود أو قيود على الأرباح.",
    icon: "📈",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            لماذا تختارنا كشريك؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نحن لا نقدم فقط منتجات، بل نقدم حلولاً متكاملة تساعدك على بناء مشروع
            تجاري ناجح.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6 group-hover:animate-float">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
