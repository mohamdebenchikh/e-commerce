import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Badge,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { popularProducts, productCategories, Product } from "@/data/products";

export default function PopularProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(
    new Set(),
  );

  const filteredProducts = popularProducts.filter(
    (product) =>
      selectedCategory === "الكل" || product.category === selectedCategory,
  );

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favoriteProducts);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavoriteProducts(newFavorites);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.discount && (
            <BadgeComponent className="bg-red-500 text-white">
              -{product.discount}%
            </BadgeComponent>
          )}
          {product.isBestseller && (
            <BadgeComponent className="bg-primary text-white">
              <TrendingUp className="w-3 h-3 ml-1" />
              الأكثر مبيعاً
            </BadgeComponent>
          )}
          {product.isNew && (
            <BadgeComponent className="bg-green-500 text-white">
              جديد
            </BadgeComponent>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart
              className={`w-4 h-4 ${favoriteProducts.has(product.id) ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full moroccan-gradient text-white border-0">
            <ShoppingCart className="w-4 h-4 ml-2" />
            اختر للتسويق
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Category */}
          <span className="text-sm text-primary font-medium">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            منتجاتنا المتميزة
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اختر من مجموعة متنوعة من المنتجات عالية الجودة، حدد سعرك واربح
            الفرق! نحن نتكفل بالتوصيل لجميع المدن المغربية
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {productCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${
                selectedCategory === category
                  ? "moroccan-gradient text-white border-0"
                  : "hover:bg-primary hover:text-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <Link to="/products">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Badge className="w-5 h-5 ml-2" />
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t">
          {[
            { number: "500+", label: "منتج متنوع" },
            { number: "حرية كاملة", label: "في تحديد السعر" },
            { number: "4.8", label: "تقييم المنتجات" },
            { number: "توصي�� مجاني", label: "نحن نتكفل به" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
