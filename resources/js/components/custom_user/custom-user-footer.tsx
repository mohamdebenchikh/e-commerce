import { Link, usePage } from '@inertiajs/react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLogo from '@/components/app-logo';

// Helper to get translations (ensure this is consistent with your app's i18n setup)
const __ = (key: string, replacements = {}) => {
    const { translations } = usePage().props as unknown as { translations: Record<string, string> };
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};


export default function CustomUserFooter() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: route('welcome') + '#home', labelKey: 'main.nav_home' },
        { href: route('welcome') + '#about', labelKey: 'main.nav_about_us' },
        { href: route('welcome') + '#how-it-works', labelKey: 'main.nav_how_it_works' },
        { href: route('welcome') + '#products', labelKey: 'main.nav_products' },
        { href: route('welcome') + '#contact', labelKey: 'main.nav_contact_us' },
    ];

    const legalLinks = [
        { href: '#', labelKey: 'main.footer_terms_of_service' }, // Replace # with actual route if available
        { href: '#', labelKey: 'main.footer_privacy_policy' },
        { href: '#', labelKey: 'main.footer_refund_policy' },
        { href: route('welcome') + '#faq', labelKey: 'main.footer_faq' }, // Assuming FAQ is on welcome page
    ];

    const socialLinks = [
        { href: '#', icon: Facebook, label: 'Facebook' },
        { href: '#', icon: Instagram, label: 'Instagram' },
        { href: '#', icon: Twitter, label: 'Twitter' },
        { href: '#', icon: Youtube, label: 'YouTube' },
        { href: '#', icon: Linkedin, label: 'LinkedIn' },
    ];


    return (
        <footer className="bg-gray-900 text-gray-300 dark:bg-background/90 dark:text-foreground/80 border-t border-gray-700 dark:border-border/20">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info & Logo */}
                    <div className="lg:col-span-1 space-y-4">
                        <Link href={route('welcome')} className="inline-block">
                            <AppLogo className="h-10 w-auto text-primary" />
                        </Link>
                        <p className="text-sm leading-relaxed">
                            {__('main.footer_company_description')}
                        </p>
                        <div className="flex space-x-3 rtl:space-x-reverse">
                            {socialLinks.map(social => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-9 h-9 bg-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white dark:text-primary mb-4">{__('main.footer_quick_links')}</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.labelKey}>
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-primary transition-colors"
                                    >
                                        {__(link.labelKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white dark:text-primary mb-4">{__('main.footer_legal')}</h4>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.labelKey}>
                                    <Link // Using Inertia Link if these become internal pages
                                        href={link.href} // Update with actual routes later
                                        className="text-sm hover:text-primary transition-colors"
                                    >
                                        {__(link.labelKey)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Newsletter Signup */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h4 className="text-lg font-semibold text-white dark:text-primary mb-4">{__('main.footer_newsletter_title')}</h4>
                        <p className="text-sm mb-3">
                            {__('main.footer_newsletter_description')}
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
                            <Input
                                type="email"
                                placeholder={__('main.footer_email_placeholder')}
                                className="bg-gray-800 dark:bg-muted border-gray-700 dark:border-border text-white dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground flex-grow"
                                aria-label={__('main.footer_email_placeholder')}
                            />
                            <Button type="submit" className="moroccan-gradient text-white border-0 px-5 hover:opacity-90 transition-opacity">
                                {__('main.footer_subscribe_button')}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 dark:border-border/20 py-6">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-start">
                        <p className="text-xs text-gray-400 dark:text-muted-foreground/80">
                            &copy; {currentYear} {__('main.app_name')}. {__('main.footer_all_rights_reserved')}.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-muted-foreground/80 mt-2 md:mt-0">
                            {__('main.footer_made_with_love')} <span className="text-primary">&hearts;</span> {__('main.footer_in_morocco')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
