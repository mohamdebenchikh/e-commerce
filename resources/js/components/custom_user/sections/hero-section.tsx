import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper to get translations
const __ = (key: string, replacements = {}) => {
    const { translations } = usePage().props as unknown as { translations: Record<string, string> };
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};

const heroSlidesData = [
    {
        titleKey: 'main.hero_title_1',
        subtitleKey: 'main.hero_subtitle_1',
        image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        bgGradient: 'from-amber-900/80 via-orange-800/70 to-red-900/80',
        cta1Key: 'main.join_now',
        cta1Link: 'register',
        cta2Key: 'main.learn_more',
        cta2Link: '#how-it-works',
    },
    {
        titleKey: 'main.hero_title_2',
        subtitleKey: 'main.hero_subtitle_2',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        bgGradient: 'from-green-900/80 via-emerald-800/70 to-teal-900/80',
        cta1Key: 'main.join_now',
        cta1Link: 'register',
        cta2Key: 'main.learn_more',
        cta2Link: '#how-it-works',
    },
    {
        titleKey: 'main.hero_title_3',
        subtitleKey: 'main.hero_subtitle_3',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
        bgGradient: 'from-blue-900/80 via-indigo-800/70 to-purple-900/80',
        cta1Key: 'main.join_now',
        cta1Link: 'register',
        cta2Key: 'main.learn_more',
        cta2Link: '#how-it-works',
    },
];

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { component } = usePage();


    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
        }, 7000); // Increased interval
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlidesData.length) % heroSlidesData.length);
    };

    // Translate slide content
    const heroSlides = heroSlidesData.map(slide => ({
        ...slide,
        title: __(slide.titleKey),
        subtitle: __(slide.subtitleKey),
        cta1Text: __(slide.cta1Key),
        cta2Text: __(slide.cta2Key),
    }));


    return (
        <section id="home" className="relative h-[calc(100vh-4rem)] md:h-screen overflow-hidden -mt-16 md:mt-0 pt-16 md:pt-0"> {/* Adjust for header height */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                >
                    <div className="absolute inset-0">
                        {slide.image && (
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
                    </div>

                    <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-4 lg:px-8">
                            <div className="max-w-3xl rtl:text-right">
                                <h1
                                    className={`text-4xl md:text-6xl font-bold text-white mb-6 leading-tight ${
                                        isVisible ? 'animate-fadeIn' : ''
                                    }`}
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    {slide.title}
                                </h1>
                                <p
                                    className={`text-lg md:text-xl text-white/90 mb-8 leading-relaxed ${
                                        isVisible ? 'animate-fadeIn' : ''
                                    }`}
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    {slide.subtitle}
                                </p>
                                <div
                                    className={`flex flex-col sm:flex-row gap-4 ${
                                        isVisible ? 'animate-fadeIn' : ''
                                    } rtl:space-x-reverse`}
                                    style={{ animationDelay: '0.6s' }}
                                >
                                    <Link href={route(slide.cta1Link)}>
                                        <Button
                                            size="lg"
                                            className="bg-white text-primary hover:bg-white/90 text-md px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            {slide.cta1Text}
                                        </Button>
                                    </Link>
                                    <a href={slide.cta2Link}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-white text-white hover:bg-white hover:text-primary text-md px-8 py-3 rounded-full backdrop-blur-sm bg-black/10"
                                        >
                                            {slide.cta2Text}
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                aria-label={__('main.previous_slide')}
                className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
                onClick={nextSlide}
                aria-label={__('main.next_slide')}
                className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 rtl:space-x-reverse">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                            index === currentSlide ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/70'
                        }`}
                        role="tab"
                        aria-selected={index === currentSlide}
                        aria-label={`${__('main.go_to_slide')} ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
