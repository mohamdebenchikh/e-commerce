import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  Bell,
  Settings,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "لوحة التحكم",
    href: "/dashboard",
    exact: true,
  },
  {
    icon: Package,
    label: "المنتجات",
    href: "/dashboard/products",
  },
  {
    icon: Heart,
    label: "منتجاتي المختارة",
    href: "/dashboard/selected-products",
  },
  {
    icon: ShoppingCart,
    label: "طلباتي",
    href: "/dashboard/orders",
    badge: "3",
  },
  {
    icon: TrendingUp,
    label: "الأرباح",
    href: "/dashboard/earnings",
  },
  {
    icon: Bell,
    label: "الإشعارات",
    href: "/dashboard/notifications",
    badge: "5",
  },
  {
    icon: User,
    label: "الملف الشخصي",
    href: "/dashboard/profile",
  },
  {
    icon: Settings,
    label: "الإعدادات",
    href: "/dashboard/settings",
  },
];

interface SidebarNavigationProps {
  onItemClick?: () => void;
}

export default function SidebarNavigation({
  onItemClick,
}: SidebarNavigationProps) {
  const location = useLocation();

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(item.href, item.exact);

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
            onClick={onItemClick}
          >
            <div className="flex items-center space-x-reverse space-x-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <Badge
                className={`text-xs ${
                  isActive ? "bg-white text-primary" : "bg-red-500 text-white"
                }`}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
