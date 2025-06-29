import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import { trans } from '@/lib/utils';

export function LanguageSwitcher() {
    const { locale } = usePage<SharedData>().props;

    const languages = [
        { code: 'ar', name: trans('arabic') },
        { code: 'en', name: trans('english') },
        { code: 'fr', name: trans('french') },
    ];

    return (
        <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} size={'sm'}>
                    <Globe className='size-4 me-1' />
                    {languages.find(lang => lang.code === locale)?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' >
                {languages.map(lang => (
                    <DropdownMenuItem dir={locale === 'ar' ? 'rtl' : 'ltr'} key={lang.code} asChild>
                        <a href={route('locale', lang.code)} className="w-full cursor-pointer">
                            {lang.name}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}