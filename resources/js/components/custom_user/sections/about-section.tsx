
// Helper to get translations

import { trans } from "@/lib/utils";

const statsData = [
    { numberKey: 'stats_partners_number', labelKey: 'stats_partners_label' },
    { numberKey: 'stats_products_number', labelKey: 'stats_products_label' },
    { numberKey: 'stats_delivery_number', labelKey: 'stats_delivery_label' },
    { numberKey: 'stats_coverage_number', labelKey: 'stats_coverage_label' },
];

export default function AboutSection() {
    const stats = statsData.map(s => ({
        number: trans(s.numberKey),
        label: trans(s.labelKey),
    }));
    return (
        <section id="about" className="py-12 md:py-20 bg-background dark:bg-background/70">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="rtl:text-right">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">{trans('about_us_title')}</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2 md:mb-3">{trans('about_who_we_are_title')}</h3>
                                <p className="text-md md:text-lg text-muted-foreground leading-relaxed">
                                    {trans('about_who_we_are_desc')}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="p-4 md:p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
                                    <h4 className="text-lg font-semibold text-primary mb-2">{trans('about_mission_title')}</h4>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {trans('about_mission_desc')}
                                    </p>
                                </div>
                                <div className="p-4 md:p-6 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                                    <h4 className="text-lg font-semibold text-primary mb-2">{trans('about_commitment_title')}</h4>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {trans('about_commitment_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-4 md:p-6 bg-card rounded-lg shadow-md hover:shadow-moroccan transition-all duration-300"
                            >
                                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-muted-foreground text-sm md:text-base font-medium">
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
