import { User, Search, Share2 as ShareIcon, DollarSign } from 'lucide-react'; // Renamed Share to ShareIcon to avoid conflict
import { Card, CardContent } from '@/components/ui/card';
import { trans } from '@/lib/utils';



const stepsData = [
    { step: '1', titleKey: 'how_step_1_title', descriptionKey: 'how_step_1_desc', icon: User },
    { step: '2', titleKey: 'how_step_2_title', descriptionKey: 'how_step_2_desc', icon: Search },
    { step: '3', titleKey: 'how_step_3_title', descriptionKey: 'how_step_3_desc', icon: ShareIcon },
    { step: '4', titleKey: 'how_step_4_title', descriptionKey: 'how_step_4_desc', icon: DollarSign },
];

export default function HowItWorksSection() {
    const steps = stepsData.map(s => ({
        ...s,
        title: trans(s.titleKey),
        description: trans(s.descriptionKey),
    }));

    return (
        <section id="how-it-works" className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/10 dark:to-black/20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{trans('how_it_works_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{trans('how_it_works_subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {steps.map((item, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1.5 bg-card/80 backdrop-blur-sm"
                        >
                            <CardContent className="p-6 md:p-8 text-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                                </div>
                                <div className="absolute top-3 rtl:left-3 ltr:right-3 w-7 h-7 md:w-8 md:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-md">
                                    {item.step}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
