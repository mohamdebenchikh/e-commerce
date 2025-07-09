import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, trans } from '@/lib/utils';
import { SharedData } from '@/types';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    showBackButton?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function AuthLayout({
    children,
    title,
    description,
    showBackButton = true,
    maxWidth = 'lg'
}: AuthLayoutProps) {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };


    const {locale} = usePage<SharedData>().props;

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <div className={cn("min-h-screen bg-background", dir )} dir={dir}>
            {/* Moroccan Pattern Background */}
            <div className="fixed inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur relative z-10">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {showBackButton && (
                            <Link href={route('home')} className="flex items-center">
                                <Button variant="ghost" size="sm">
                                    {dir === "rtl" ?  <ArrowRight className="h-4 w-4 ml-2" /> : <ArrowLeft className='h-4 w-4 ml-2' />}
                                    {trans('Back to Home')}
                                </Button>
                            </Link>
                        )}
                        <Link href={route('home')} className="text-2xl font-bold text-primary">
                            {trans('app_name')}
                        </Link>
                        {!showBackButton && <div />} {/* Spacer for centering */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 lg:px-8 relative z-10">
                <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
                    <Card className="shadow-moroccan border-0">
                        <CardHeader className="text-center space-y-4">
                            <CardTitle className="text-3xl font-bold text-foreground">
                                {title}
                            </CardTitle>
                            <p className="text-muted-foreground">
                                {description}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
