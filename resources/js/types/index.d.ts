import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
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

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    bio: string;
    national_id: string;
    country: string;
    city: string;
    payment_method: string;
    bank_name: string;
    rib_number:string;
    email: string;
    photo?: string;
    gender: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    active: boolean;
    [key: string]: unknown; // This allows for additional properties...
}
