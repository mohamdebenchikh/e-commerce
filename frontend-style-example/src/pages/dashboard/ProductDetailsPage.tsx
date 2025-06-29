import { useParams } from "react-router-dom";
import { popularProducts, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Download, ExternalLink, FileText, Video, Image as ImageIcon, Info, ShoppingCart, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Helper to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ar-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(price);
};

// Function to trigger download of product data
const downloadProductData = (product: Product) => {
  const dataToDownload = {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    suggestedPrice: product.suggestedPrice,
    category: product.category,
    rating: product.rating,
    reviews: product.reviews,
    estimatedProfit: product.estimatedProfit,
    images: product.images || [product.image],
    videos: product.videos || [],
    documents: product.documents || [],
    referenceLinks: product.referenceLinks || [],
  };
  const jsonString = JSON.stringify(dataToDownload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${product.name.replace(/\s+/g, '_').toLowerCase()}_details.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = popularProducts.find((p) => p.id === productId);

  if (!product) {
    // TODO: Replace with a proper "Not Found" component or redirect
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-destructive">المنتج غير موجود</h1>
        <p className="text-muted-foreground mt-4">
          عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.
        </p>
        <Button onClick={() => window.history.back()} className="mt-6">
          العودة للخلف
        </Button>
      </div>
    );
  }

  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{product.category}</Badge>
            {product.isBestseller && <Badge className="bg-orange-500 text-white">الأكثر مبيعاً</Badge>}
            {product.isNew && <Badge className="bg-green-500 text-white">جديد</Badge>}
          </div>
        </div>
        <Button onClick={() => downloadProductData(product)} size="lg" className="moroccan-gradient text-white mt-4 md:mt-0">
          <Download className="ml-2 h-5 w-5" />
          تحميل بيانات المنتج
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Videos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="h-6 w-6 text-primary" />
                صور المنتج
              </CardTitle>
            </CardHeader>
            <CardContent>
              {displayImages.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {displayImages.map((imgSrc, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                              <img
                                src={imgSrc}
                                alt={`${product.name} - صورة ${index + 1}`}
                                className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop";
                                }}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {displayImages.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background" />
                    </>
                  )}
                </Carousel>
              ) : (
                <p className="text-muted-foreground">لا توجد صور متاحة لهذا المنتج.</p>
              )}
            </CardContent>
          </Card>

          {/* Videos Section */}
          {product.videos && product.videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Video className="h-6 w-6 text-primary" />
                  مقاطع فيديو المنتج
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.videos.map((videoUrl, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden shadow">
                    <video controls src={videoUrl} className="w-full h-full object-cover">
                      متصفحك لا يدعم عرض الفيديو.
                    </video>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Info className="h-6 w-6 text-primary" />
                تفاصيل المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              <Separator />
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} تقييم)
                </span>
              </div>
              <Separator />
              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">السعر لك:</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(product.basePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">السعر المقترح للبيع:</span>
                  <span className="text-lg font-semibold text-blue-600">{formatPrice(product.suggestedPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-muted-foreground">الربح المتوقع:</span>
                  <span className="text-xl font-bold">{formatPrice(product.estimatedProfit)}</span>
                </div>
              </div>
              <Separator />
              <Button size="lg" className="w-full moroccan-gradient text-white">
                <ShoppingCart className="ml-2 h-5 w-5" />
                اختر المنتج (أضف للمنتجات المختارة)
              </Button>
            </CardContent>
          </Card>

          {/* Documents Section */}
          {product.documents && product.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6 text-primary" />
                  مستندات المنتج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{doc.name}</span>
                    <Download className="h-4 w-4 text-primary" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reference Links Section */}
          {product.referenceLinks && product.referenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ExternalLink className="h-6 w-6 text-primary" />
                  روابط مرجعية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.referenceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
