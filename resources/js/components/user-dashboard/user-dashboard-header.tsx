import { usePage } from '@inertiajs/react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { trans } from '@/lib/utils';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/language-switcher';
import  AppearanceDropdown from '@/components/appearance-dropdown';

export default function UserDashboardHeader() {
    const { auth } = usePage<SharedData>().props;
    const { isMobile } = useSidebar();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                
                {/* Welcome Message */}
                <div className="flex flex-col">
                    <h1 className="text-sm font-medium">
                        {trans('user_dashboard_welcome', { name: auth.user?.first_name || trans('user') })}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {trans('user_dashboard_welcome_subtitle')}
                    </p>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Search - Hidden on mobile */}
                {!isMobile && (
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={trans('user_dashboard_search_placeholder')}
                            className="w-64 pl-8"
                        />
                    </div>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        3
                    </span>
                    <span className="sr-only">{trans('user_dashboard_notifications')}</span>
                </Button>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Theme Switcher */}
                <AppearanceDropdown />
            </div>
        </header>
    );
}
