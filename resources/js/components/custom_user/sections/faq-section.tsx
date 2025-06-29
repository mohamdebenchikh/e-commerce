import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

// Helper to get translations
const __ = (key: string, replacements = {}) => {
    const { translations } = usePage().props as unknown as { translations: Record<string, string> };
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};

const faqItemsData = [
    { questionKey: 'main.faq_q1', answerKey: 'main.faq_a1' },
    { questionKey: 'main.faq_q2', answerKey: 'main.faq_a2' },
    { questionKey: 'main.faq_q3', answerKey: 'main.faq_a3' },
    { questionKey: 'main.faq_q4', answerKey: 'main.faq_a4' },
];

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
    return (
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm">
            <button
                onClick={onClick}
                className="w-full p-4 md:p-6 text-start flex justify-between items-center hover:bg-muted/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
                aria-expanded={isOpen}
            >
                <h3 className="text-md md:text-lg font-semibold text-foreground flex-1 ltr:mr-4 rtl:ml-4">{question}</h3>
                <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{answer}</p>
                </div>
            )}
        </Card>
    );
}

export default function FAQSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqItems = faqItemsData.map(item => ({
        question: __(item.questionKey),
        answer: __(item.answerKey),
    }));

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section id="faq" className="py-12 md:py-20 bg-gradient-to-b from-background dark:from-background/70 to-secondary/10 dark:to-black/20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{__('main.faq_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{__('main.faq_subtitle')}</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
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
