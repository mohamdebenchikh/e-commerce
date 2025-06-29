import { ReactNode } from 'react';
import CustomUserHeader from '@/components/custom_user/custom-user-header';
import CustomUserFooter from '@/components/custom_user/custom-user-footer';
import { usePage } from '@inertiajs/react'; // To get locale
import { Head } from '@inertiajs/react'; // For page title

interface CustomUserShellLayoutProps {
    children: ReactNode;
    title?: string; // Optional title for the page
}

export default function CustomUserShellLayout({ children, title }: CustomUserShellLayoutProps) {
    const { props } = usePage();
    const locale = (props.ziggy as any)?.query?.locale || (props.jetstream as any)?.flash?.locale || 'en'; // Adjust based on how locale is passed
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-background text-foreground" dir={direction}>
                {/* Moroccan Pattern Background from frontend-style-example */}
                <div className="fixed inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

                <CustomUserHeader />

                <main className="relative z-10 container mx-auto px-4 py-8">
                    {children}
                </main>

                <CustomUserFooter />
            </div>
        </>
    );
}
