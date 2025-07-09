import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, MapPin, FolderOpen, Package, ShoppingCart, Tag } from 'lucide-react';
import AppLogo from '../app-logo';
import { trans } from '@/lib/utils';
import { NavAdmin } from './nav-admin';

const mainNavItems: NavItem[] = [
    {
        title: trans("dashboard"),
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: trans("users"),
        href: route('admin.users.index'),
        icon: Users,
    },
    {
        title: trans("orders"),
        href: route('admin.orders.index'),
        icon: ShoppingCart,
    },
    {
        title: trans("cities"),
        href: route('admin.cities.index'),
        icon: MapPin,
    },
    {
        title: trans("categories"),
        href: route('admin.categories.index'),
        icon: FolderOpen,
    },
    {
        title: trans("tags"),
        href: route('admin.tags.index'),
        icon: Tag,
    },
    {
        title: trans("products"),
        href: route('admin.products.index'),
        icon: Package,
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
