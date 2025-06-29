import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { trans } from '@/lib/utils';
import { NavAdmin } from './nav-admin';

const mainNavItems: NavItem[] = [
    {
        title: trans("dashboard"),
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
];


export function AdminSidebar() {

    const {locale} = usePage<SharedData>().props

    return (
        <Sidebar collapsible="icon" side={locale === 'ar' ? 'right' : 'left'} variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavAdmin/>
            </SidebarFooter>
        </Sidebar>
    );
}
