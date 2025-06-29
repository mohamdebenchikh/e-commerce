import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Star, Heart, Share2, ShoppingCart, Badge as BadgeIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Assuming this is your Badge component

// Helper to get translations
const __ = (key: string, replacements = {}) => {
    const { translations } = usePage().props as unknown as { translations: Record<string, string> };
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(r => {
        translation = translation.replace(`:${r}`, (replacements as any)[r]);
    });
    return translation;
};

// Mock product data (replace with actual data source later)
interface Product {
    id: string;
    nameKey: string;
    descriptionKey: string;
    categoryKey: string;
    image: string;
    basePrice: number;
    suggestedPrice: number;
    estimatedProfit: number;
    rating: number;
    reviews: number;
    discount?: number;
    isBestseller?: boolean;
    isNew?: boolean;
}

const mockProducts: Product[] = [
    {
        id: '1',
        nameKey: 'main.product_name_1',
        descriptionKey: 'main.product_desc_1',
        categoryKey: 'main.category_electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        basePrice: 120,
        suggestedPrice: 180,
        estimatedProfit: 60,
        rating: 4.5,
        reviews: 150,
        isBestseller: true,
    },
    {
        id: '2',
        nameKey: 'main.product_name_2',
        descriptionKey: 'main.product_desc_2',
        categoryKey: 'main.category_clothing',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        basePrice: 250,
        suggestedPrice: 350,
        estimatedProfit: 100,
        rating: 4.2,
        reviews: 95,
        isNew: true,
        discount: 10,
    },
    {
        id: '3',
        nameKey: 'main.product_name_3',
        descriptionKey: 'main.product_desc_3',
        categoryKey: 'main.category_homegoods',
        image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        basePrice: 300,
        suggestedPrice: 450,
        estimatedProfit: 150,
        rating: 4.8,
        reviews: 210,
    },
    {
        id: '4',
        nameKey: 'main.product_name_4',
        descriptionKey: 'main.product_desc_4',
        categoryKey: 'main.category_beauty',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        basePrice: 80,
        suggestedPrice: 120,
        estimatedProfit: 40,
        rating: 4.0,
        reviews: 70,
        isNew: true,
    },
];

const productCategoriesData = [
    { key: 'main.category_all', value: 'الكل' },
    { key: 'main.category_electronics', value: 'إلكترونيات' },
    { key: 'main.category_clothing', value: 'ملابس' },
    { key: 'main.category_homegoods', value: 'أدوات منزلية' },
    { key: 'main.category_beauty', value: 'جمال وعناية' },
];


export default function PopularProductsSection() {
    const [selectedCategoryValue, setSelectedCategoryValue] = useState('الكل'); // Default to the actual value for filtering
    const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(new Set());

    const productCategories = productCategoriesData.map(cat => ({...cat, label: __(cat.key)}));

    const translatedProducts = mockProducts.map(p => ({
        ...p,
        name: __(p.nameKey),
        description: __(p.descriptionKey),
        category: __(p.categoryKey),
    }));

    const filteredProducts = translatedProducts.filter(
        (product) =>
            selectedCategoryValue === 'الكل' || product.category === selectedCategoryValue,
    );

    const toggleFavorite = (productId: string) => {
        setFavoriteProducts(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) newFavorites.delete(productId);
            else newFavorites.add(productId);
            return newFavorites;
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(price);
    };

    const ProductCard = ({ product }: { product: Product & {name: string, description: string, category: string} }) => (
        <Card className="group hover:shadow-moroccan transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 rtl:right-2 ltr:left-2 flex flex-col gap-1">
                    {product.discount && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
                    {product.isBestseller && <Badge className="bg-primary text-white"><TrendingUp className="w-3 h-3 ltr:mr-1 rtl:ml-1" />{__('main.bestseller')}</Badge>}
                    {product.isNew && <Badge className="bg-green-500 text-white">{__('main.new_product')}</Badge>}
                </div>
                <div className="absolute top-2 rtl:left-2 ltr:right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full p-0" onClick={() => toggleFavorite(product.id)}>
                        <Heart className={`w-4 h-4 ${favoriteProducts.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full p-0"><Share2 className="w-4 h-4" /></Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full moroccan-gradient text-white border-0 text-sm py-2">
                        <ShoppingCart className="w-4 h-4 ltr:mr-2 rtl:ml-2" />{__('main.select_for_marketing')}
                    </Button>
                </div>
            </div>
            <CardContent className="p-4">
                <span className="text-xs text-primary font-medium">{product.category}</span>
                <h3 className="font-semibold text-md leading-tight line-clamp-2 my-1">{product.name}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-2">{product.description}</p>
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews} {__('main.reviews')})</span>
                </div>
                <div>
                    <div className="flex items-baseline justify-between text-xs mb-1">
                        <span className="text-primary font-bold text-sm">{formatPrice(product.basePrice)} <span className="text-muted-foreground text-xs">{__('main.your_price')}</span></span>
                        <span className="text-blue-600 font-medium">{__('main.suggested')}: {formatPrice(product.suggestedPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 font-medium">{__('main.estimated_profit')}: {formatPrice(product.estimatedProfit)}</span>
                        <span className="text-muted-foreground">{__('main.delivery_included')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <section id="products" className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{__('main.popular_products_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{__('main.popular_products_subtitle')}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
                    {productCategories.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategoryValue === category.value ? 'default' : 'outline'}
                            className={`rounded-full px-4 py-1.5 text-sm md:text-base md:px-6 md:py-2 ${selectedCategoryValue === category.value ? 'moroccan-gradient text-white border-0' : 'hover:bg-primary/80 hover:text-white'}`}
                            onClick={() => setSelectedCategoryValue(category.value)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                <div className="text-center">
                    <Link href={'#'} /* Replace with actual products page route */ >
                        <Button size="lg" variant="outline" className="px-6 py-3 text-md md:text-lg hover:bg-primary hover:text-white transition-all duration-300">
                            <BadgeIcon className="w-4 h-4 md:w-5 md:h-5 ltr:mr-2 rtl:ml-2" />{__('main.view_all_products')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
