import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "عائشة الزهراء",
    role: "مسوقة من الدار البيضاء",
    content:
      "أسعار الجملة ممتازة والتوصيل سريع. بدأت بـ 5 منتجات والآن أربح أكثر من 3000 درهم شهرياً!",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "كريم بن علي",
    role: "مسوق من فاس",
    content:
      "الحرية في تحديد الأسعار رائعة. أبيع لأصدقائي وأحياناً أربح 100% على المنتج الواحد!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "نادية القاسمي",
    role: "مسوقة من الرباط",
    content:
      "لا أقلق بشأن التوصيل أبداً، هم يتولون كل شيء وأنا أركز فقط على البيع والربح.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            قصص مسوقينا الناجحين
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            استمع إلى تجارب المسوقين الذين حققوا أرباحاً ممتازة معنا
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ml-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
