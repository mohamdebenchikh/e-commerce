import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type Category, type Product, type Tag } from '@/types';
import ProductForm from './product-form';
import Heading from '@/components/heading';

interface EditProductProps {
    product: Product;
    categories: Category[];
    tags: Tag[];
}

export default function EditProduct({ product, categories, tags }: EditProductProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('products'), href: route('admin.products.index') },
        { title: trans('edit_product'), href: route('admin.products.edit', product.id) },
    ];



    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('edit_product')} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <Heading title={trans("edit_product")} description={trans("edit_product_details")} />


                <ProductForm
                    product={product}
                    categories={categories}
                    tags={tags}
                />
            </div>
        </AdminLayout>
    );
}