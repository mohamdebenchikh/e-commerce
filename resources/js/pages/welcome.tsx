import CustomUserShellLayout from '@/layouts/custom-user-shell-layout';
import HeroSection from '@/components/custom_user/sections/hero-section';
import PopularProductsSection from '@/components/custom_user/sections/popular-products-section';
import HowItWorksSection from '@/components/custom_user/sections/how-it-works-section';
import AboutSection from '@/components/custom_user/sections/about-section';
import WhyChooseSection from '@/components/custom_user/sections/why-choose-section';
import TestimonialsSection from '@/components/custom_user/sections/testimonials-section';
import FAQSection from '@/components/custom_user/sections/faq-section';
import ContactSection from '@/components/custom_user/sections/contact-section';
import FinalCTASection from '@/components/custom_user/sections/final-cta-section';
import { usePage } from '@inertiajs/react';

// Helper to get translations (ensure this is consistent with your app's i18n setup)
// If you have a global __ function or usePage().props.translations elsewhere, you can reuse that.
const __ = (key: string, replacements = {}) => {
    // Attempt to get translations from page props
    const props = usePage().props as any; // Cast to any to check for translations flexibly
    const translations = props.translations || (props.jetstream as any)?.flash?.translations || {};

    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};

export default function Welcome() {
    // The Head component for title will be handled by CustomUserShellLayout
    // We pass the desired title to it.
    return (
        <CustomUserShellLayout title={__('main.welcome_page_title', { app_name: __('main.app_name') }) || 'Welcome'}>
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

            {/* FAQ Section */}
            <FAQSection />

            {/* Contact Section */}
            <ContactSection />

            {/* Final CTA */}
            <FinalCTASection />
        </CustomUserShellLayout>
    );
}
