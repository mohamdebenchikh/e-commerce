export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number; // السعر الأساسي للمسوق
  suggestedPrice: number; // السعر المقترح للبيع
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isBestseller?: boolean;
  isNew?: boolean;
  estimatedProfit: number; // الربح المتوقع بناء على السعر المقترح
  images?: string[]; // For multiple product images
  videos?: string[]; // For media video URLs
  documents?: { name: string; url: string }[]; // For downloadable documents
  referenceLinks?: { title: string; url: string }[]; // For reference links
}

export const popularProducts: Product[] = [
  {
    id: "1",
    name: "سجادة مغربية تقليدية",
    description: "سجادة منسوجة يدوياً من الصوف الطبيعي بتصاميم أمازيغية أصيلة. تتميز بألوانها الزاهية ونقوشها الفريدة التي تحكي قصصاً من التراث المغربي العريق. مثالية لإضافة لمسة دافئة وأنيقة إلى أي غرفة.",
    basePrice: 800, // السعر للمسوق (شامل التوصيل)
    suggestedPrice: 1200, // السعر المقترح للبيع
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop",
    category: "ديكور منزلي",
    rating: 4.8,
    reviews: 156,
    isBestseller: true,
    estimatedProfit: 400,
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561043433-9265f830ce45?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=600&fit=crop",
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video
    ],
    documents: [
      { name: "دليل العناية بالسجاد", url: "/docs/carpet_care_guide.pdf" },
      { name: "شهادة الأصالة", url: "/docs/authenticity_certificate.pdf" },
    ],
    referenceLinks: [
      { title: "تاريخ السجاد المغربي", url: "https://example.com/moroccan-carpet-history" },
      { title: "أفكار ديكور بالسجاد", url: "https://example.com/carpet-decor-ideas" },
    ],
  },
  {
    id: "2",
    name: "زيت الأركان العضوي",
    description: "زيت الأركان النقي 100% من المغرب، مضاد للشيخوخة ومرطب طبيعي",
    basePrice: 150,
    suggestedPrice: 250,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
    category: "منتجات تجميل",
    rating: 4.9,
    reviews: 324,
    isBestseller: true,
    estimatedProfit: 100,
  },
  {
    id: "3",
    name: "طقم أواني طبخ مغربي",
    description:
      "طقم كامل من الطاجين والكسكسي التقليدي المصنوع من الطين الطبيعي",
    basePrice: 500,
    suggestedPrice: 800,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    category: "أدوات مطبخ",
    rating: 4.7,
    reviews: 89,
    isNew: true,
    estimatedProfit: 300,
  },
  {
    id: "4",
    name: "قفطان مغربي فاخر",
    description: "قفطان نسائي مطرز بخيوط ذهبية، تصميم عصري بلمسة تراثية",
    basePrice: 400,
    suggestedPrice: 650,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    category: "ملابس تقليدية",
    rating: 4.6,
    reviews: 203,
    estimatedProfit: 250,
  },
  {
    id: "5",
    name: "شاي ��خضر مغربي بالنعناع",
    description:
      "مزيج فاخر من الشاي الأخضر والنعناع الطبيعي، معبأ في علب أنيقة",
    basePrice: 80,
    suggestedPrice: 120,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop",
    category: "مشروبات",
    rating: 4.5,
    reviews: 67,
    estimatedProfit: 40,
  },
  {
    id: "6",
    name: "حقيبة جلدية مغربية",
    description: "حقيبة يد نسائية من الجلد الطبيعي المدبوغ تقليدياً في فاس",
    basePrice: 300,
    suggestedPrice: 450,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "اكسسوارات",
    rating: 4.8,
    reviews: 142,
    isBestseller: true,
    estimatedProfit: 150,
  },
  {
    id: "7",
    name: "عود مغربي فاخر",
    description: "عود عالي الجودة برائحة مميزة، مصنوع من أجود أنواع الخشب",
    basePrice: 120,
    suggestedPrice: 180,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
    category: "عطور",
    rating: 4.7,
    reviews: 98,
    isNew: true,
    estimatedProfit: 60,
  },
  {
    id: "8",
    name: "مصباح مغربي نحاسي",
    description: "مصباح تقليدي منحوت يدوياً من النحاس، يضفي أجواء رومانسية",
    basePrice: 220,
    suggestedPrice: 320,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    category: "ديكور منزلي",
    rating: 4.6,
    reviews: 78,
    estimatedProfit: 100,
  },
];

export const productCategories = [
  "الكل",
  "ديكور منزلي",
  "منتجات تجميل",
  "ملابس تقليدية",
  "أدوات مطبخ",
  "اكسسوارات",
  "عطور",
  "مشروبات",
];
