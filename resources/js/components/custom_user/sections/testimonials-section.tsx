import { Card, CardContent } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';

// Helper to get translations
const __ = (key: string, replacements = {}) => {
    const { translations } = usePage().props as unknown as { translations: Record<string, string> };
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};

const testimonialsData = [
    {
        nameKey: 'main.testimonial_1_name',
        roleKey: 'main.testimonial_1_role',
        contentKey: 'main.testimonial_1_content',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        rating: 5,
    },
    {
        nameKey: 'main.testimonial_2_name',
        roleKey: 'main.testimonial_2_role',
        contentKey: 'main.testimonial_2_content',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
    },
    {
        nameKey: 'main.testimonial_3_name',
        roleKey: 'main.testimonial_3_role',
        contentKey: 'main.testimonial_3_content',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        rating: 4,
    },
];

export default function TestimonialsSection() {
    const testimonials = testimonialsData.map(t => ({
        ...t,
        name: __(t.nameKey),
        role: __(t.roleKey),
        content: __(t.contentKey),
    }));

    return (
        <section id="testimonials" className="py-12 md:py-20 bg-background dark:bg-background/70">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{__('main.testimonials_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{__('main.testimonials_subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1.5 bg-card/80 backdrop-blur-sm"
                        >
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center mb-4 md:mb-6 rtl:space-x-reverse">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ltr:mr-4 rtl:ml-4 shadow-sm"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-md md:text-lg text-foreground">{testimonial.name}</h4>
                                        <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic mb-3 md:mb-4">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'fill-current' : ''}`} />
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
