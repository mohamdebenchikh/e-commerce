import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import PopularProductsSection from "@/components/sections/PopularProductsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import AboutSection from "@/components/sections/AboutSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import FAQSection from "@/components/sections/FAQSection";

export default function Index() {
  return (
    <Layout>
      {/* Hero Carousel Section */}
      <HeroSection />

      {/* Popular Products Section */}
      <PopularProductsSection />

      {/* How it Works */}
      <HowItWorksSection />

      {/* About Section */}
      <AboutSection />

      {/* Why Choose Section */}
      <WhyChooseSection />

      {/* Success Stories */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-orange-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-moroccan-pattern opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              ابدأ مشروعك التجاري اليوم!
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              احصل على منتجات بأسعار الجملة، حدد أسعارك، ونحن نتكفل بالتوصيل.
              ابدأ الربح من اليوم الأول!
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                انضم كمسوق الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
