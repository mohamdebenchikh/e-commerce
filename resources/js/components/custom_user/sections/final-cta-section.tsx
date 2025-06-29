import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { trans } from '@/lib/utils';



export default function FinalCTASection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-orange-600 to-red-600 text-white relative overflow-hidden">
            {/* Moroccan pattern overlay */}
            <div className="absolute inset-0 bg-moroccan-pattern opacity-10 pointer-events-none" />
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        {trans('final_cta_title')}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/90">
                        {trans('final_cta_subtitle')}
                    </p>
                    <Link href={route('register')}>
                        <Button
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90 text-md md:text-lg px-10 py-3 md:px-12 md:py-3.5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                        >
                            {trans('final_cta_button')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
