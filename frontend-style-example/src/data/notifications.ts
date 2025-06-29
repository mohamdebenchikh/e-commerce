export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "payment" | "product" | "system" | "promotion";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "طلب جديد تم تأكيده",
    message: "تم تأكيد طلبك رقم #12345 وجاري التحضير للشحن",
    type: "order",
    isRead: false,
    createdAt: "2024-01-20T10:30:00Z",
    actionUrl: "/dashboard/orders/12345",
    icon: "📦",
  },
  {
    id: "2",
    title: "تم إضافة منتج جديد",
    message: 'منتج "قفطان مغربي فاخر" متاح الآن للتسويق',
    type: "product",
    isRead: false,
    createdAt: "2024-01-20T09:15:00Z",
    actionUrl: "/dashboard/products",
    icon: "🆕",
  },
  {
    id: "3",
    title: "تم إيداع الأرباح",
    message: "تم إيداع 350 درهم في حسابك المصرفي",
    type: "payment",
    isRead: true,
    createdAt: "2024-01-19T14:20:00Z",
    actionUrl: "/dashboard/earnings",
    icon: "💰",
  },
  {
    id: "4",
    title: "عرض خاص لفترة محدودة",
    message: "خصم 15% على جميع منتجات التجميل حتى نهاية الشهر",
    type: "promotion",
    isRead: true,
    createdAt: "2024-01-18T08:00:00Z",
    actionUrl: "/dashboard/products?category=beauty",
    icon: "🎉",
  },
  {
    id: "5",
    title: "تحديث في النظام",
    message: "تم تحسين واجهة لوحة التحكم لتجربة أفضل",
    type: "system",
    isRead: true,
    createdAt: "2024-01-17T12:00:00Z",
    icon: "🔧",
  },
];

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  basePrice: number;
  sellPrice: number;
  profit: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export const mockOrders: Order[] = [
  {
    id: "12345",
    productId: "1",
    productName: "سجادة مغربية تقليدية",
    productImage:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop",
    customerName: "فاطمة الزهراء",
    customerPhone: "+212612345678",
    customerAddress: "شارع الحسن الثاني، رقم 25",
    customerCity: "الرباط",
    basePrice: 800,
    sellPrice: 1200,
    profit: 400,
    status: "shipped",
    orderDate: "2024-01-18T10:30:00Z",
    estimatedDelivery: "2024-01-22T18:00:00Z",
    trackingNumber: "TN123456789",
  },
  {
    id: "12346",
    productId: "2",
    productName: "زيت الأركان العضوي",
    productImage:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop",
    customerName: "أحمد العلوي",
    customerPhone: "+212623456789",
    customerAddress: "حي النخيل، شقة 12",
    customerCity: "الدار البيضاء",
    basePrice: 150,
    sellPrice: 220,
    profit: 70,
    status: "confirmed",
    orderDate: "2024-01-19T14:20:00Z",
    estimatedDelivery: "2024-01-23T18:00:00Z",
  },
  {
    id: "12347",
    productId: "4",
    productName: "قفطان مغربي فاخر",
    productImage:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop",
    customerName: "خديجة المرابط",
    customerPhone: "+212634567890",
    customerAddress: "زنقة الأطلس، رقم 18",
    customerCity: "فاس",
    basePrice: 400,
    sellPrice: 650,
    profit: 250,
    status: "delivered",
    orderDate: "2024-01-15T09:15:00Z",
    estimatedDelivery: "2024-01-19T18:00:00Z",
    trackingNumber: "TN987654321",
  },
  {
    id: "12348",
    productId: "6",
    productName: "حقيبة جلدية مغربية",
    productImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    customerName: "يوسف الإدريسي",
    customerPhone: "+212645678901",
    customerAddress: "شارع محمد الخامس، عمارة 5",
    customerCity: "مراكش",
    basePrice: 300,
    sellPrice: 450,
    profit: 150,
    status: "pending",
    orderDate: "2024-01-20T11:45:00Z",
  },
];
