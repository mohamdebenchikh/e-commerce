import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  X,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockOrders, Order } from "@/data/notifications";
import {
  PrimaryButton,
  SecondaryButton,
  FloatingButton,
} from "@/components/ui/custom-buttons";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders
    .filter(
      (order) =>
        order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery),
    )
    .filter((order) => statusFilter === "all" || order.status === statusFilter);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle;
      case "shipped":
        return Truck;
      case "confirmed":
        return Package;
      case "pending":
        return Clock;
      case "cancelled":
        return X;
      default:
        return Clock;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalEarnings = filteredOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.profit, 0);

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: filteredOrders.length.toString(),
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "طلبات مؤكدة",
      value: filteredOrders
        .filter((o) => o.status === "confirmed")
        .length.toString(),
      icon: CheckCircle,
      color: "text-yellow-600",
    },
    {
      title: "قيد الشحن",
      value: filteredOrders
        .filter((o) => o.status === "shipped")
        .length.toString(),
      icon: Truck,
      color: "text-blue-600",
    },
    {
      title: "الأرباح المحققة",
      value: formatPrice(totalEarnings),
      icon: DollarSign,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            طلباتي
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            تتبع جميع طلباتك وأرباحك
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/dashboard/orders/new" className="flex-1 sm:flex-none">
            <PrimaryButton className="w-full sm:w-auto">
              <Package className="w-4 h-4 ml-2" />
              طلب جديد
            </PrimaryButton>
          </Link>
          <SecondaryButton className="flex-1 sm:flex-none">
            <Eye className="w-4 h-4 ml-2" />
            تصدير
          </SecondaryButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <Icon
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} self-end sm:self-center`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث في الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكدة</SelectItem>
                <SelectItem value="shipped">قيد الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground mb-4">
              لم نجد أي طلبات تطابق البحث الحالي
            </p>
            <Link to="/dashboard/orders/new">
              <PrimaryButton>إضافة طلب جديد</PrimaryButton>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <Card
                key={order.id}
                className="hover:shadow-moroccan transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Mobile-first layout */}
                    <div className="flex items-start space-x-reverse space-x-3">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                              {order.productName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={`${getStatusColor(order.status)} text-xs`}
                              >
                                <StatusIcon className="w-3 h-3 ml-1" />
                                {getStatusText(order.status)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                #{order.id}
                              </span>
                            </div>
                          </div>
                          <div className="text-right sm:text-left">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(order.profit)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ربح
                            </div>
                          </div>
                        </div>

                        {/* Order details */}
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <span className="font-medium ml-1">الزبون:</span>
                            <span className="truncate">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 ml-1 flex-shrink-0" />
                            <span className="truncate">
                              {order.customerCity}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 ml-1 flex-shrink-0" />
                            <span>{formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium ml-1">البيع:</span>
                            <span>{formatPrice(order.sellPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <SecondaryButton
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            التفاصيل
                          </SecondaryButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>
                              تفاصيل الطلب #{selectedOrder?.id}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Product Info */}
                              <div className="flex items-center space-x-reverse space-x-4 p-4 bg-muted/50 rounded-lg">
                                <img
                                  src={selectedOrder.productImage}
                                  alt={selectedOrder.productName}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {selectedOrder.productName}
                                  </h3>
                                  <Badge
                                    className={getStatusColor(
                                      selectedOrder.status,
                                    )}
                                  >
                                    {getStatusText(selectedOrder.status)}
                                  </Badge>
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold mb-3">
                                  معلومات الزبون
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <span className="font-medium ml-2">
                                        الاسم:
                                      </span>
                                      <span>{selectedOrder.customerName}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="w-4 h-4 ml-2" />
                                      <span>{selectedOrder.customerPhone}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 ml-2" />
                                      <span>{selectedOrder.customerCity}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedOrder.customerAddress}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Details */}
                              <div>
                                <h4 className="font-semibold mb-3">
                                  تفاصيل الطلب
                                </h4>
                                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                  <div className="flex justify-between">
                                    <span>تاريخ الطلب:</span>
                                    <span>
                                      {formatDateTime(selectedOrder.orderDate)}
                                    </span>
                                  </div>
                                  {selectedOrder.estimatedDelivery && (
                                    <div className="flex justify-between">
                                      <span>التسليم المتوقع:</span>
                                      <span>
                                        {formatDateTime(
                                          selectedOrder.estimatedDelivery,
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {selectedOrder.trackingNumber && (
                                    <div className="flex justify-between">
                                      <span>رقم التتبع:</span>
                                      <span className="font-mono">
                                        {selectedOrder.trackingNumber}
                                      </span>
                                    </div>
                                  )}
                                  <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                      <span>سعر البيع:</span>
                                      <span>
                                        {formatPrice(selectedOrder.sellPrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>التكلفة الأساسية:</span>
                                      <span>
                                        {formatPrice(selectedOrder.basePrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                      <span>ربحك الصافي:</span>
                                      <span className="text-green-600">
                                        {formatPrice(selectedOrder.profit)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {order.customerPhone && (
                        <SecondaryButton
                          size="sm"
                          className="flex-1 sm:flex-none"
                          onClick={() => {
                            window.open(`tel:${order.customerPhone}`, "_self");
                          }}
                        >
                          <Phone className="w-4 h-4 ml-2 sm:ml-0 sm:mr-0" />
                          <span className="sm:hidden">اتصال</span>
                        </SecondaryButton>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Action Button for mobile */}
      <Link to="/dashboard/orders/new" className="lg:hidden">
        <FloatingButton>
          <Package className="w-6 h-6" />
        </FloatingButton>
      </Link>
    </div>
  );
}
