import { Card, CardContent } from '@/components/ui/card';
import { trans } from '@/lib/utils';


const featuresData = [
    { titleKey: 'why_feature_1_title', descriptionKey: 'why_feature_1_desc', icon: '💸' },
    { titleKey: 'why_feature_2_title', descriptionKey: 'why_feature_2_desc', icon: '🚚' },
    { titleKey: 'why_feature_3_title', descriptionKey: 'why_feature_3_desc', icon: '📈' },
];

export default function WhyChooseSection() {
    const features = featuresData.map(f => ({
        ...f,
        title: trans(f.titleKey),
        description: trans(f.descriptionKey),
    }));

    return (
        <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/10 dark:from-black/20 to-background dark:to-background/70">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{trans('why_choose_us_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{trans('why_choose_us_subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1.5 bg-card/80 backdrop-blur-sm"
                        >
                            <CardContent className="p-6 md:p-8 text-center">
                                <div className="text-5xl md:text-6xl mb-4 md:mb-6 group-hover:animate-float">{feature.icon}</div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3 text-primary">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
