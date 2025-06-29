export default function AboutSection() {
  const stats = [
    { number: "2,500+", label: "مسوق شريك" },
    { number: "500+", label: "منتج متنوع" },
    { number: "98%", label: "نجاح في التوصيل" },
    { number: "جميع المدن", label: "نغطي المغرب" },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              من نحن
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-3">
                  من نحن وكيف نعمل
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  نحن شركة مغربية متخصصة في توفير منتجات عالية الجودة للمسوقين
                  بأسعار الجملة. نؤمن بأن كل شخص يستحق فرصة لكسب دخل إضافي من
                  خلال التسويق، لذلك نوفر منتجات متنوعة بأسعار تنافسية مع التكفل
                  الكامل بالتوصيل.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h4 className="text-lg font-semibold text-primary mb-3">
                    مهمتنا
                  </h4>
                  <p className="text-muted-foreground">
                    توفير منتجات عالية الجودة بأسعار الجملة للمسوقين، مع ضمان
                    التوصيل السريع والآمن لجميع أنحاء المغرب، لنمكن كل شخص من
                    بناء مشروعه التجاري الخاص.
                  </p>
                </div>

                <div className="p-6 bg-secondary/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-primary mb-3">
                    التزامنا
                  </h4>
                  <p className="text-muted-foreground">
                    نلتزم بتقديم خدمة متميزة من خلال منتجات مضمونة الجودة، أسعار
                    تنافسية، وتوصيل موثوق. نحن شريكك في النجاح وليس مجرد مورد.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-moroccan transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
