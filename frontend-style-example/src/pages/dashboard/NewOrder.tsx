import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Package,
  User,
  MapPin,
  Phone,
  DollarSign,
  Calculator,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { popularProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const moroccanCities = [
  "الرباط",
  "الدار البيضاء",
  "فاس",
  "مراكش",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "الجديدة",
  "القنيطرة",
  "تطوان",
  "سلا",
  "تمارة",
  "المحمدية",
  "العرائش",
  "خريبكة",
  "برشيد",
  "إنزكان",
  "سطات",
  "الناظور",
];

const orderSchema = z.object({
  productId: z.string().min(1, "يجب اختيار منتج"),
  sellPrice: z.number().min(1, "سعر البيع مطلوب"),
  customerName: z.string().min(2, "اسم الزبون يجب أن يكون حرفين على الأقل"),
  customerPhone: z
    .string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\-\s]+$/, "رقم الهاتف غير صحيح"),
  customerCity: z.string().min(1, "مدينة الزبون مطلوبة"),
  customerAddress: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  notes: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function NewOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: searchParams.get("product") || "",
      sellPrice: 0,
      customerName: "",
      customerPhone: "",
      customerCity: "",
      customerAddress: "",
      notes: "",
    },
  });

  const watchedProductId = watch("productId");
  const watchedSellPrice = watch("sellPrice");

  useEffect(() => {
    if (watchedProductId) {
      const product = popularProducts.find((p) => p.id === watchedProductId);
      setSelectedProduct(product);
      if (product && !watchedSellPrice) {
        setValue("sellPrice", product.suggestedPrice);
      }
    }
  }, [watchedProductId, setValue, watchedSellPrice]);

  const profit =
    selectedProduct && watchedSellPrice
      ? watchedSellPrice - selectedProduct.basePrice
      : 0;

  const profitMargin =
    selectedProduct && watchedSellPrice
      ? ((profit / selectedProduct.basePrice) * 100).toFixed(1)
      : "0";

  const onSubmit = async (data: OrderForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order ID
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${orderId}. سنتواصل معك قريباً لتأكيد التفاصيل.`,
      });

      navigate("/dashboard/orders");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">طلب جديد</h1>
        <p className="text-muted-foreground">
          أضف طلب جديد لزبون وابدأ في تحقيق الأرباح
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 ml-2" />
                اختيار المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">المنتج *</Label>
                <Select
                  value={watchedProductId}
                  onValueChange={(value) => setValue("productId", value)}
                >
                  <SelectTrigger
                    className={`text-right ${
                      errors.productId ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="اختر المنتج" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularProducts.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id}
                        className="text-right"
                      >
                        <div className="flex items-center space-x-reverse space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(product.basePrice)} •{" "}
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-sm text-destructive text-right">
                    {errors.productId.message}
                  </p>
                )}
              </div>

              {selectedProduct && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-reverse space-x-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedProduct.description}
                      </p>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Badge>{selectedProduct.category}</Badge>
                        {selectedProduct.isBestseller && (
                          <Badge className="bg-orange-500">الأكثر مبيعاً</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sellPrice">سعر البيع للزبون *</Label>
                <div className="relative">
                  <Input
                    id="sellPrice"
                    type="number"
                    placeholder="أدخل سعر البيع"
                    {...register("sellPrice", { valueAsNumber: true })}
                    className={`text-right pr-16 ${
                      errors.sellPrice ? "border-destructive" : ""
                    }`}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    د.م
                  </span>
                </div>
                {errors.sellPrice && (
                  <p className="text-sm text-destructive text-right">
                    {errors.sellPrice.message}
                  </p>
                )}
                {selectedProduct && (
                  <p className="text-sm text-muted-foreground text-right">
                    السعر المقترح: {formatPrice(selectedProduct.suggestedPrice)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profit Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 ml-2" />
                حاسبة الأرباح
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>سعرك الأساسي:</span>
                      <span className="font-medium">
                        {formatPrice(selectedProduct.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>سعر البيع:</span>
                      <span className="font-medium">
                        {formatPrice(watchedSellPrice || 0)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">ربحك الصافي:</span>
                        <span
                          className={`font-bold text-lg ${
                            profit > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatPrice(profit)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>هامش الربح:</span>
                        <span
                          className={
                            profit > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {profitMargin}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {profit <= 0 && watchedSellPrice > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-800">
                          سعر البيع منخفض جداً. لن تحقق أي ربح!
                        </p>
                      </div>
                    </div>
                  )}

                  {profit > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-800">
                          ربح ممتاز! استمر في هذا المعدل.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  اختر منتج أولاً لحساب الأرباح
                </p>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 ml-2" />
                معلومات الزبون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">اسم الزبون *</Label>
                  <Input
                    id="customerName"
                    placeholder="الاسم الكامل للزبون"
                    {...register("customerName")}
                    className={`text-right ${
                      errors.customerName ? "border-destructive" : ""
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive text-right">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                  <Input
                    id="customerPhone"
                    placeholder="+212 6XX-XXXXXX"
                    {...register("customerPhone")}
                    className={`text-right ${
                      errors.customerPhone ? "border-destructive" : ""
                    }`}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-destructive text-right">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerCity">المدينة *</Label>
                <Select
                  value={watch("customerCity")}
                  onValueChange={(value) => setValue("customerCity", value)}
                >
                  <SelectTrigger
                    className={`text-right ${
                      errors.customerCity ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="اختر مدينة الزبون" />
                  </SelectTrigger>
                  <SelectContent>
                    {moroccanCities.map((city) => (
                      <SelectItem
                        key={city}
                        value={city}
                        className="text-right"
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerCity && (
                  <p className="text-sm text-destructive text-right">
                    {errors.customerCity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress">العنوان الكامل *</Label>
                <Textarea
                  id="customerAddress"
                  placeholder="العنوان التفصيلي للزبون..."
                  {...register("customerAddress")}
                  className={`text-right resize-none ${
                    errors.customerAddress ? "border-destructive" : ""
                  }`}
                  rows={3}
                />
                {errors.customerAddress && (
                  <p className="text-sm text-destructive text-right">
                    {errors.customerAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  placeholder="أي ملاحظات خاصة بالطلب..."
                  {...register("notes")}
                  className="text-right resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 ml-2" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-medium">{selectedProduct.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>سعر المنتج + التوصيل:</span>
                        <span>{formatPrice(selectedProduct.basePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>سعر البيع:</span>
                        <span>{formatPrice(watchedSellPrice || 0)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>ربحك الصافي:</span>
                        <span className="text-green-600">
                          {formatPrice(profit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={isLoading || profit <= 0}
                      className="w-full moroccan-gradient text-white border-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                          جاري الإرسال...
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 ml-2" />
                          إرسال الطلب
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      سيتم التواصل معك خلال 30 دقيقة لتأكيد الطلب
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  اختر منتج أولاً
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
