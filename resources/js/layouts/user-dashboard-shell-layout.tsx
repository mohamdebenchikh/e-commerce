import { ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { trans } from '@/lib/utils';
import UserDashboardSidebar from '@/components/user-dashboard/user-dashboard-sidebar';
import UserDashboardHeader from '@/components/user-dashboard/user-dashboard-header';

interface UserDashboardShellLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function UserDashboardShellLayout({ children, title }: UserDashboardShellLayoutProps) {
    const { locale, sidebarOpen } = usePage<SharedData>().props;
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <>
            {title && <Head title={trans(title)} />}
            <SidebarProvider defaultOpen={sidebarOpen}>
                <div className="min-h-screen bg-background text-foreground" dir={direction}>
                    
                    <div className="flex min-h-screen w-full">
                        <UserDashboardSidebar />
                        
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <UserDashboardHeader />
                            
                            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
