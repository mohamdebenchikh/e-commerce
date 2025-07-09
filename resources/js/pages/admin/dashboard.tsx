import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: trans("dashboard"),
        href: '/dashboard',
    },
];

export default function Dashboard() {

    const {locale} = usePage<SharedData>().props;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans("dashboard")} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className='text-xl '>{locale}</h1>
                <h2 className='text-xl'>{trans("throttle",{seconds:"67"})}</h2>
            </div>
        </AdminLayout>
    );
}
