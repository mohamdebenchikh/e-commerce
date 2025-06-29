import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Grid,
  List,
  SortAsc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PrimaryButton,
  SecondaryButton,
  FloatingButton,
} from "@/components/ui/custom-buttons";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { popularProducts, productCategories, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(
    new Set(),
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(["1", "2", "4"]), // Pre-selected products
  );

  const { toast } = useToast();

  const filteredProducts = popularProducts
    .filter(
      (product) =>
        selectedCategory === "الكل" || product.category === selectedCategory,
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.basePrice - b.basePrice;
        case "price-high":
          return b.basePrice - a.basePrice;
        case "profit-high":
          return b.estimatedProfit - a.estimatedProfit;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favoriteProducts);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast({
        title: "تم إزالة المنتج من المفضلة",
        description: "تم إزالة المنتج من قائمة المفضلة",
      });
    } else {
      newFavorites.add(productId);
      toast({
        title: "تم إضافة المنتج للمفضلة",
        description: "تم حفظ المنتج في قائمة المفضلة",
      });
    }
    setFavoriteProducts(newFavorites);
  };

  const toggleSelected = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      toast({
        title: "تم إزالة المنتج من منتجاتي",
        description: "لن يظهر هذا المنتج في قائمة منتجاتك المختارة",
      });
    } else {
      newSelected.add(productId);
      toast({
        title: "تم إضافة المنتج لمنتجاتي",
        description: "يمكنك الآن تسويق هذا المنتج",
      });
    }
    setSelectedProducts(newSelected);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Link to={`/dashboard/products/${product.id}`} className="block group">
      <Card className="hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === "grid" ? "h-48" : "h-32"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isBestseller && (
            <Badge className="bg-orange-500 text-white text-xs">
              الأكثر مبيعاً
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-green-500 text-white text-xs">جديد</Badge>
          )}
          {selectedProducts.has(product.id) && (
            <Badge className="bg-blue-500 text-white text-xs">مختار</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 rounded-full p-0"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart
              className={`w-4 h-4 ${
                favoriteProducts.has(product.id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 rounded-full p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Category */}
          <span className="text-sm text-primary font-medium">
            {product.category}
          </span>

          {/* Product Name */}
          <h3
            className={`font-semibold leading-tight line-clamp-2 ${
              viewMode === "grid" ? "text-lg" : "text-base"
            }`}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
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

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.basePrice)}
                </span>
                <span className="text-xs text-muted-foreground">السعر لك</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-blue-600 font-medium">
                  مقترح: {formatPrice(product.suggestedPrice)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 font-medium">
                ربح متوقع: {formatPrice(product.estimatedProfit)}
              </span>
              <span className="text-muted-foreground">شامل التوصيل</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => toggleSelected(product.id)}
              className={`flex-1 text-sm ${
                selectedProducts.has(product.id)
                  ? "bg-green-600 hover:bg-green-700"
                  : "moroccan-gradient"
              } text-white border-0`}
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              {selectedProducts.has(product.id) ? "مختار ✓" : "اختر"}
            </Button>
            <Link to={`/dashboard/orders/new?product=${product.id}`}>
              <SecondaryButton size="sm" className="text-sm">
                اطلب
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </CardContent>
      </Card>
    </Link>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Link to={`/dashboard/products/${product.id}`} className="block group">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-reverse space-x-4">
            <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm text-primary font-medium">
                  {product.category}
                </span>
                <h3 className="font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {product.isBestseller && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    الأكثر مبيعاً
                  </Badge>
                )}
                {selectedProducts.has(product.id) && (
                  <Badge className="bg-blue-500 text-white text-xs">
                    مختار
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-4">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.basePrice)}
                </span>
                <span className="text-sm text-green-600">
                  ربح: {formatPrice(product.estimatedProfit)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteProducts.has(product.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  onClick={() => toggleSelected(product.id)}
                  className={
                    selectedProducts.has(product.id)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "moroccan-gradient text-white border-0"
                  }
                >
                  {selectedProducts.has(product.id) ? "مختار ✓" : "اختر"}
                </Button>
                <Link to={`/dashboard/orders/new?product=${product.id}`}>
                  <SecondaryButton size="sm">اطلب</SecondaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            كتالوج المنتجات
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            اختر من {filteredProducts.length} منتج متاح للتسويق
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/dashboard/selected-products"
            className="flex-1 sm:flex-none"
          >
            <SecondaryButton className="w-full sm:w-auto">
              منتجاتي المختارة ({selectedProducts.size})
            </SecondaryButton>
          </Link>
          <Link to="/dashboard/orders/new" className="flex-1 sm:flex-none">
            <PrimaryButton className="w-full sm:w-auto">
              <ShoppingCart className="w-4 h-4 ml-2" />
              إضافة طلب
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto">
                  <SortAsc className="w-4 h-4 ml-2" />
                  ترتيب حسب
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  الاسم
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                  السعر من الأقل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                  السعر من الأعلى
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("profit-high")}>
                  الربح الأعلى
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  التقييم
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground">
              لم نجد أي منتجات تطابق البحث الحالي
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) =>
            viewMode === "grid" ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductListItem key={product.id} product={product} />
            ),
          )}
        </div>
      )}

      {/* Floating Action Button for mobile */}
      <Link to="/dashboard/orders/new" className="lg:hidden">
        <FloatingButton>
          <ShoppingCart className="w-6 h-6" />
        </FloatingButton>
      </Link>
    </div>
  );
}
