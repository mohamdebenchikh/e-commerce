import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function trans(key: string, replacements?: Record<string, string>) {
    let translation = _translations[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            translation = translation.replace(new RegExp(`:${k}\\b`, 'g'), v);
        });
    }
    return translation;
}