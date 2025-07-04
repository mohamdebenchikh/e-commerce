import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User, Menu as MenuIcon, X, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type SharedData, type User as UserType } from '@/types';
import AppLogo from '@/components/app-logo'; // Using existing logo
import { UserMenuContent } from '@/components/user-menu-content'; // Existing component for user actions
import { LanguageSwitcher } from '@/components/language-switcher'; // Existing component
import { trans } from '@/lib/utils';


export default function CustomUserHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth, locale } = usePage<SharedData>().props;
    const user = auth.user as UserType | null;

    // Navigation items will be translated
    const navigationItems = [
        { href: '#home', labelKey: 'nav_home', inertiaLink: false }, // Assuming these are anchor links on the same page
        { href: '#products', labelKey: 'nav_products', inertiaLink: false },
        { href: '#how-it-works', labelKey: 'nav_how_it_works', inertiaLink: false },
        { href: '#about', labelKey: 'nav_about_us', inertiaLink: false },
        { href: '#contact', labelKey: 'nav_contact_us', inertiaLink: false },
    ];

    return (
        <header dir={locale === 'ar' ? 'rtl' : 'ltr'} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href={route('home')} className="text-2xl font-bold text-primary mr-4">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
                        {navigationItems.map((item) => (
                            item.inertiaLink ? (
                                <Link
                                    key={item.labelKey}
                                    href={item.href}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    {trans(item.labelKey)}
                                </Link>
                            ) : (
                                <a
                                    key={item.labelKey}
                                    href={item.href}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    {trans(item.labelKey)}
                                </a>
                            )
                        ))}
                    </nav>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <LanguageSwitcher />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="px-2">
                                        <User className="h-5 w-5" />
                                        <span className="sr-only">{trans('user_menu_open')}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <UserMenuContent user={user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href={route('login')}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hidden md:inline-flex"
                                    >
                                        <User className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                                        {trans('login')}
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button
                                        size="sm"
                                        className="moroccan-gradient text-white hover:opacity-90 transition-opacity"
                                    >
                                        {trans('register_join_now')}
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                            <span className="sr-only">{trans('mobile_menu_toggle')}</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col space-y-2">
                            {navigationItems.map((item) => (
                                item.inertiaLink ? (
                                    <Link
                                        key={item.labelKey}
                                        href={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {trans(item.labelKey)}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.labelKey}
                                        href={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {trans(item.labelKey)}
                                    </a>
                                )
                            ))}
                            {!user && (
                                <>
                                    <Link href={route('login')} onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full justify-start px-3 py-2">
                                            <User className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                                            {trans('login')}
                                        </Button>
                                    </Link>
                                    <Link href={route('register')} onClick={() => setIsMenuOpen(false)}>
                                        <Button size="sm" className="w-full moroccan-gradient text-white mt-2">
                                            {trans('register_join_now')}
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
