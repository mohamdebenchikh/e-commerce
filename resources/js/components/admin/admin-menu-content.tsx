import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Admin, SharedData,} from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { AdminInfo } from './admin-info';

interface UserMenuContentProps {
    user: Admin;
}

export function AdminMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { locale } = usePage<SharedData>().props

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    <AdminInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link dir={locale === 'ar' ? 'rtl' : 'ltr'} className="block w-full" href={route('admin.profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link dir={locale === 'ar' ? 'rtl' : 'ltr'} className="block w-full" method="post" href={route('admin.logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
