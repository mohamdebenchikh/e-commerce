import { Link } from "react-router-dom";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrimaryButton, SecondaryButton } from "@/components/ui/custom-buttons";
import { useAuth } from "@/contexts/AuthContext";
import { mockOrders } from "@/data/notifications";
import { popularProducts } from "@/data/products";

export default function Dashboard() {
  const { user } = useAuth();

  const recentOrders = mockOrders.slice(0, 4);
  const featuredProducts = popularProducts.slice(0, 4);

  const stats = [
    {
      title: "إجمالي الأرباح",
      value: `${user?.totalEarnings?.toLocaleString()} د.م`,
      icon: DollarSign,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "إجمالي الطلبات",
      value: user?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "المنتجات المختارة",
      value: "12",
      icon: Heart,
      change: "+3",
      changeType: "positive",
    },
    {
      title: "معدل النجاح",
      value: "94%",
      icon: TrendingUp,
      change: "+2%",
      changeType: "positive",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم";
      case "shipped":
        return "قيد الشحن";
      case "confirmed":
        return "مؤكد";
      case "pending":
        return "في الانتظار";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary via-orange-500 to-red-500 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          مرحباً، {user?.firstName}! 👋
        </h1>
        <p className="text-white/90 mb-4">
          إليك نظرة سريع�� على أداءك كمسوق خلال هذا الشهر
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard/products" className="flex-1 sm:flex-none">
            <SecondaryButton
              size="sm"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
            >
              <Package className="w-4 h-4 ml-2" />
              تصفح المنتجات
            </SecondaryButton>
          </Link>
          <Link to="/dashboard/orders/new" className="flex-1 sm:flex-none">
            <SecondaryButton
              size="sm"
              className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary"
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              إضافة طلب جديد
            </SecondaryButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-moroccan transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mt-1 sm:mt-2">
                      {stat.value}
                    </p>
                    <div
                      className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      {stat.change} هذا الشهر
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center self-end sm:self-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>أحدث الطلبات</CardTitle>
            <Link to="/dashboard/orders">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 ml-2" />
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center space-x-reverse space-x-4 p-4 bg-muted/50 rounded-lg"
                >
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {order.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName} • {order.customerCity}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      ربح: {formatPrice(order.profit)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>منتجات مميزة</CardTitle>
            <Link to="/dashboard/products">
              <Button variant="ghost" size="sm">
                <Package className="w-4 h-4 ml-2" />
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-reverse space-x-4 p-4 bg-muted/50 rounded-lg"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="flex items-center space-x-reverse space-x-2 mt-1">
                      <span className="text-sm font-medium text-primary">
                        {formatPrice(product.basePrice)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-green-600">
                        ربح: {formatPrice(product.estimatedProfit)}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    اختر
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/dashboard/orders/new" className="block">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  إضافة طلب جديد
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  اطلب منتج لزبون جديد واحصل على ربحك
                </p>
              </div>
            </Link>

            <Link to="/dashboard/products" className="block">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  تصفح المنتجات
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  اكتشف منتجات جديدة لتسويقها
                </p>
              </div>
            </Link>

            <Link to="/dashboard/profile" className="block">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  تحديث الملف الشخصي
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  تأكد من صحة معلوماتك الشخصية
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
