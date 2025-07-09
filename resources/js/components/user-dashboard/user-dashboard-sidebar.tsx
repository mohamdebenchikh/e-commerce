import { usePage } from '@inertiajs/react';
import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
} from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { trans } from '@/lib/utils';
import {
    LayoutDashboard,
    User,
    ShoppingBag,
    Heart,
    CreditCard,
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    Package
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';

const dashboardNavItems = [
    {
        title: 'user_dashboard_overview',
        href: '/user/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'user_dashboard_profile',
        href: '/user/profile',
        icon: User,
    },
    {
        title: 'user_dashboard_products',
        href: '/user/products',
        icon: Package,
    },
    {
        title: 'user_dashboard_orders',
        href: '/user/orders',
        icon: ShoppingBag,
    },
    {
        title: 'user_dashboard_wishlist',
        href: '/user/wishlist',
        icon: Heart,
    },
    {
        title: 'user_dashboard_payments',
        href: '/user/payments',
        icon: CreditCard,
    },
    {
        title: 'user_dashboard_notifications',
        href: '/user/notifications',
        icon: Bell,
    },
];

const settingsNavItems = [
    {
        title: 'user_dashboard_settings',
        href: '/user/settings',
        icon: Settings,
    },
    {
        title: 'user_dashboard_help',
        href: '/user/help',
        icon: HelpCircle,
    },
];

export default function UserDashboardSidebar() {
    const { locale } = usePage<SharedData>().props;
    const page = usePage();

    return (
        <Sidebar
            collapsible="icon"
            side={locale === 'ar' ? 'right' : 'left'}
            variant="inset"
            className="border-sidebar-border"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/user/dashboard" className="flex items-center gap-2">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>{trans('user_dashboard_main_nav')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {dashboardNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(item.href)}
                                        tooltip={{ children: trans(item.title) }}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2">
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            <span>{trans(item.title)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>{trans('user_dashboard_settings_nav')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(item.href)}
                                        tooltip={{ children: trans(item.title) }}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2">
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            <span>{trans(item.title)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
