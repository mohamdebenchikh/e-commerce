import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Share2,
  ShoppingCart,
  Trash2,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { popularProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export default function SelectedProducts() {
  // Mock selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(["1", "2", "4", "6"]),
  );

  const { toast } = useToast();

  const selectedProducts = popularProducts.filter((product) =>
    selectedProductIds.has(product.id),
  );

  const removeFromSelected = (productId: string) => {
    const newSelected = new Set(selectedProductIds);
    newSelected.delete(productId);
    setSelectedProductIds(newSelected);
    toast({
      title: "تم إزالة المنتج",
      description: "تم إزالة المنتج من قائمة منتجاتك المختارة",
    });
  };

  const generateShareLink = (productId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/product/${productId}?ref=marketer_${Math.random().toString(36).substr(2, 9)}`;
  };

  const copyShareLink = (productId: string) => {
    const link = generateShareLink(productId);
    navigator.clipboard.writeText(link);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المشاركة إلى الحافظة",
    });
  };

  const shareToWhatsApp = (product: any) => {
    const message = `🛍️ منتج رائع: ${product.name}

📝 الوصف: ${product.description}

💰 السعر: ${formatPrice(product.suggestedPrice)}
📦 شامل التوصيل لجميع المدن المغربية

🔗 للطلب: ${generateShareLink(product.id)}

#سوق_المغرب #تسوق_آمن`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToFacebook = (product: any) => {
    const url = generateShareLink(product.id);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank");
  };

  const exportProductList = () => {
    const productData = selectedProducts.map((product) => ({
      اسم_المنتج: product.name,
      الفئة: product.category,
      السعر_الأساسي: product.basePrice,
      السعر_المقترح: product.suggestedPrice,
      الربح_المتوقع: product.estimatedProfit,
      رابط_المشاركة: generateShareLink(product.id),
    }));

    const csvContent = [
      Object.keys(productData[0]).join(","),
      ...productData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "منتجاتي_المختارة.csv";
    link.click();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            منتجاتي المختارة
          </h1>
          <p className="text-muted-foreground">
            لديك {selectedProducts.length} منتج جاهز للتسويق
          </p>
        </div>
        <div className="flex items-center space-x-reverse space-x-2">
          <Button variant="outline" onClick={exportProductList}>
            <Download className="w-4 h-4 ml-2" />
            تصدير القائمة
          </Button>
          <Link to="/dashboard/products">
            <Button className="moroccan-gradient text-white border-0">
              <Heart className="w-4 h-4 ml-2" />
              إضافة منتجات
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {selectedProducts.length}
            </div>
            <div className="text-sm text-muted-foreground">منتج مختار</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(
                selectedProducts.reduce(
                  (sum, product) => sum + product.estimatedProfit,
                  0,
                ),
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              إجمالي الربح المتوقع
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(
                selectedProducts.reduce(
                  (sum, product) => sum + product.basePrice,
                  0,
                ),
              )}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي التكلفة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                (selectedProducts.reduce(
                  (sum, product) => sum + product.estimatedProfit,
                  0,
                ) /
                  selectedProducts.reduce(
                    (sum, product) => sum + product.basePrice,
                    0,
                  )) *
                  100,
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">
              متوسط هامش الربح
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {selectedProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              لم تختر أي منتجات بعد
            </h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بتصفح المنتجات واختر ما تريد تسويقه
            </p>
            <Link to="/dashboard/products">
              <Button className="moroccan-gradient text-white border-0">
                تصفح المنتجات
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-moroccan transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-blue-500 text-white">مختار</Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromSelected(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-primary font-medium">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-lg leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing Info */}
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>سعرك:</span>
                      <span className="font-bold text-primary">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>سعر مقترح:</span>
                      <span className="font-medium text-blue-600">
                        {formatPrice(product.suggestedPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span>ربح متوقع:</span>
                      <span className="font-bold text-green-600">
                        {formatPrice(product.estimatedProfit)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/orders/new?product=${product.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full moroccan-gradient text-white border-0">
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          اطلب الآن
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyShareLink(product.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Share Options */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => shareToWhatsApp(product)}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => shareToFacebook(product)}
                      >
                        Facebook
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Marketing Tips */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نصائح للتسويق الناجح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  استخدم الصور عالية الجودة
                </h4>
                <p className="text-sm text-blue-700">
                  شارك صور المنتجات الموجودة معنا - هي محسنة للمشاركة على وسائل
                  التواصل
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  اكتب وصف جذاب
                </h4>
                <p className="text-sm text-green-700">
                  ركز على فوائد المنتج وأضف تجربتك الشخصية لتزيد من الثقة
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">
                  حدد سعر تنافسي
                </h4>
                <p className="text-sm text-orange-700">
                  ابحث عن الأسعار في السوق وحدد سعراً يوازن بين الربح والمنافسة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
