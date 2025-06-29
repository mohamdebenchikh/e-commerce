import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqItems = [
  {
    question: "كيف أبدأ العمل معكم كمسوق؟",
    answer:
      "سجل حساباً مجانياً، تصفح منتجاتنا واختر ما يناسبك، ثم شارك مع أصدقائك أو على وسائل التواصل. عندما يريد أحد الشراء، أرسل لنا الطلب مع معلومات الزبون.",
  },
  {
    question: "كيف يتم حساب ربحي على كل منتج؟",
    answer:
      "ربحك = السعر الذي تبيع به - سعرنا لك (شامل التوصيل). مثال: نبيع لك منتج بـ 100 درهم شامل التوصيل، تبيعه بـ 150 درهم، ربحك 50 درهم.",
  },
  {
    question: "متى وكيف أحصل على أرباحي؟",
    answer:
      "تحصل على ربحك فور إتمام عملية البيع بنجاح وتأكيد استلام الزبون للمنتج. يمكن التحويل البنكي أو Cash Plus حسب اختيارك.",
  },
  {
    question: "هل أنتم تتكفلون بالتوصيل لجميع المدن؟",
    answer:
      "نعم، نحن نتكفل بتوصيل جميع الطلبات لكل المدن المغربية. التكلفة مدرجة في السعر الذي نبيع لك به، فلا تقلق بشأن الشحن أو التوصيل.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onClick}
        className="w-full p-6 text-right flex justify-between items-center hover:bg-muted/50 transition-colors"
      >
        <ChevronDown
          className={`h-5 w-5 text-primary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        <h3 className="text-lg font-semibold flex-1 ml-4">{question}</h3>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </Card>
  );
}

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            إجابات على الأسئلة الأكثر شيوعاً حول العمل معنا كمسوق
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openFaq === index}
              onClick={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
