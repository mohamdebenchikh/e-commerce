import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    admin:Admin
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    locale: "en" | "ar" | "fr" | string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Admin {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface City {
    id: number;
    ar_name: string;
    en_name: string;
    fr_name: string;
    shipping_cost: number;
    name: string; // Computed attribute based on current locale
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    ar_name: string;
    en_name: string;
    fr_name: string;
    ar_description?: string;
    en_description?: string;
    fr_description?: string;
    image?: string;
    is_active: boolean;
    sort_order: number;
    slug: string;
    name: string; // Computed attribute based on current locale
    description?: string; // Computed attribute based on current locale
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    details?: string;
    price: number;
    stock_quantity: number;
    is_featured: boolean;
    status: 'draft' | 'published';
    sku: string;
    image?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    categories?: Category[];
    tags?: Tag[];
    images?: ProductImage[];
    is_in_stock: boolean; // Computed attribute
    formatted_price: string; // Computed attribute
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string; // Computed attribute from first_name + last_name
    phone: string;
    bio: string;
    national_id: string;
    country: string;
    city: string;
    payment_method: string;
    bank_name: string;
    rib_number: string;
    email: string;
    photo?: string;
    avatar_url?: string; // Computed attribute for photo URL
    gender: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    active: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Order {
    id: number;
    user_id: number;
    product_id: number;
    client_name: string;
    city: string;
    address: string;
    client_phone: string;
    shipping_cost: number;
    sale_price: number;
    user_profit: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    notes?: string;
    tracking_number?: string;
    estimated_delivery?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    user?: User;
    product?: Product;

    // Computed attributes
    formatted_sale_price?: string;
    formatted_shipping_cost?: string;
    formatted_user_profit?: string;
    status_badge?: {
        label: string;
        variant: string;
    };
}
