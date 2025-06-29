import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  Eye,
  Filter,
  CheckCircle,
  Package,
  DollarSign,
  Settings,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockNotifications, Notification } from "@/data/notifications";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    if (filter !== "all") return notification.type === filter;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast({
      title: "تم تعيين جميع الإشعارات كمقروءة",
      description: "تم تحديث حالة جميع الإشعارات",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "تم حذف الإشعار",
      description: "تم حذف الإشعار بنجاح",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "product":
        return "bg-purple-100 text-purple-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      case "promotion":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "order":
        return "طلب";
      case "payment":
        return "دفع";
      case "product":
        return "منتج";
      case "system":
        return "نظام";
      case "promotion":
        return "عرض";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return Package;
      case "payment":
        return DollarSign;
      case "product":
        return Star;
      case "system":
        return Settings;
      case "promotion":
        return Star;
      default:
        return Bell;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "الآن";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `منذ ${diffInWeeks} أسبوع`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الإشعارات</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `لديك ${unreadCount} إشعار غير مقروء`
              : "جميع الإشعارات مقروءة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="w-4 h-4 ml-2" />
            تعيين الكل كمقروء
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter((n) => n.type === "order").length}
            </div>
            <div className="text-sm text-muted-foreground">
              إش��ارات الطلبات
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter((n) => n.type === "payment").length}
            </div>
            <div className="text-sm text-muted-foreground">إشعارات الدفع</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter((n) => n.type === "product").length}
            </div>
            <div className="text-sm text-muted-foreground">منتجات جديدة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {notifications.filter((n) => n.type === "promotion").length}
            </div>
            <div className="text-sm text-muted-foreground">العروض</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">غير مقروءة</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة الإشعارات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الإشعارات</SelectItem>
                <SelectItem value="unread">غير مقروءة</SelectItem>
                <SelectItem value="read">مقروءة</SelectItem>
                <SelectItem value="order">طلبات</SelectItem>
                <SelectItem value="payment">مدفوعات</SelectItem>
                <SelectItem value="product">منتجات</SelectItem>
                <SelectItem value="promotion">عروض</SelectItem>
                <SelectItem value="system">نظام</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
            <p className="text-muted-foreground">
              لا توجد إشعارات تطابق الفلتر المحدد
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                  notification.isRead
                    ? "bg-background"
                    : "bg-blue-50 border-blue-200"
                }`}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-reverse space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <Badge className={getTypeColor(notification.type)}>
                            {getTypeText(notification.type)}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Link to={notification.actionUrl}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-4 h-4 ml-2" />
                                عرض التفاصيل
                              </Button>
                            </Link>
                          )}
                        </div>

                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4 ml-2" />
                            تعيين كمقروء
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
