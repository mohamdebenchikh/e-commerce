import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/data/notifications";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "الآن";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    return `منذ ${Math.floor(diffInHours / 24)} يوم`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -left-1 bg-red-500 text-white text-xs min-w-[18px] h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">الإشعارات</h3>
            <Link to="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-xs">
                عرض الكل
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                لا توجد إشعارات جديدة
              </p>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-background"
                      : "bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-reverse space-x-3">
                    <div className="text-lg">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground truncate">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="inline-flex items-center text-xs text-primary hover:underline mt-2"
                    >
                      <Eye className="w-3 h-3 ml-1" />
                      عرض التفاصيل
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {unreadCount > 0 && (
            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                  )
                }
              >
                تعيين الكل كمقروء
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
