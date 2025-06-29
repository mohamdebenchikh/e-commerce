import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    title: "اشتري بأسعار الجملة، بع بسعرك واربح الفرق",
    subtitle:
      "نحن شركة متخصصة في توفير منتجات عالية الجودة للمسوقين. احصل على منتجاتنا بأسعار خاصة شاملة التوصيل، وبع بالسعر الذي تحدده أنت، والفرق ربحك!",
    image:
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bgGradient: "from-amber-900/80 via-orange-800/70 to-red-900/80",
  },
  {
    title: "نتكفل بالتوصيل، أنت تركز على التسويق",
    subtitle:
      "لا تقلق بشأن التوصيل أو اللوجستيات. نحن نتولى توصيل المنتجات لعملائك في جميع أنحاء المغرب، وأنت فقط ركز على التسويق وكسب الأرباح.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bgGradient: "from-green-900/80 via-emerald-800/70 to-teal-900/80",
  },
  {
    title: "سوّق بين أصدقائك أو على وسائل التواصل",
    subtitle:
      "شارك منتجاتنا مع أصدقائك ومعارفك أو على صفحاتك في وسائل التواصل الاجتماعي. كلما بعت أكثر، ربحت أكثر - الحرية كاملة في تحديد أسعارك!",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
    bgGradient: "from-blue-900/80 via-indigo-800/70 to-purple-900/80",
  },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image failed to load:", slide.image);
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}
            />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl">
                <h1
                  className={`text-5xl md:text-7xl font-bold text-white mb-6 leading-tight ${
                    isVisible ? "animate-fadeIn" : ""
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl ${
                    isVisible ? "animate-fadeIn" : ""
                  }`}
                  style={{ animationDelay: "0.4s" }}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={`flex flex-col sm:flex-row gap-4 ${
                    isVisible ? "animate-fadeIn" : ""
                  }`}
                  style={{ animationDelay: "0.6s" }}
                >
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      انضم الآن
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                  >
                    تعرف أكثر
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-reverse space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentSlide
                ? "bg-white shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
