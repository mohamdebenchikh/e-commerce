import { Head, Link,  useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { User, Product, type BreadcrumbItem } from '@/types';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface OrderCreateProps {
    users: User[];
    products: Product[];
}

export default function OrderCreate({ users, products }: OrderCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        product_id: '',
        client_name: '',
        city: '',
        address: '',
        client_phone: '',
        shipping_cost: '',
        sale_price: '',
        user_profit: '',
        status: 'pending',
        notes: '',
        tracking_number: '',
        estimated_delivery: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('orders'), href: route('admin.orders.index') },
        { title: trans('create_order'), href: route('admin.orders.create') },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.orders.store'), {
            onSuccess: () => {
                toast.success('Order created successfully');
            },
            onError: () => {
                toast.error('Failed to create order');
            }
        });
    };

    const selectedProduct = products.find(p => p.id.toString() === data.product_id);

    // Auto-calculate profit when sale price or shipping cost changes
    const handlePriceChange = (field: 'sale_price' | 'shipping_cost', value: string) => {
        setData(field, value);
        
        if (selectedProduct && data.sale_price && data.shipping_cost) {
            const salePrice = parseFloat(field === 'sale_price' ? value : data.sale_price);
            const shippingCost = parseFloat(field === 'shipping_cost' ? value : data.shipping_cost);
            const productPrice = Number(selectedProduct.price);

            if (!isNaN(salePrice) && !isNaN(shippingCost)) {
                const profit = salePrice - productPrice - shippingCost;
                setData('user_profit', profit.toFixed(2));
            }
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('create_order')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.orders.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back_to_orders')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{trans('create_order')}</h1>
                            <p className="text-muted-foreground">
                                Create a new order manually
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Assignment</CardTitle>
                                <CardDescription>
                                    Select user and product for this order
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="user_id">Assign to User</Label>
                                    <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && (
                                        <p className="text-sm text-destructive mt-1">{errors.user_id}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="product_id">Product</Label>
                                    <Select value={data.product_id} onValueChange={(value) => setData('product_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} - {Number(product.price).toFixed(2)} MAD
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_id && (
                                        <p className="text-sm text-destructive mt-1">{errors.product_id}</p>
                                    )}
                                </div>
                                {selectedProduct && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-medium">Selected Product:</p>
                                        <p className="text-sm text-muted-foreground">{selectedProduct.name}</p>
                                        <p className="text-sm text-muted-foreground">Base Price: {Number(selectedProduct.price).toFixed(2)} MAD</p>
                                        <p className="text-sm text-muted-foreground">Stock: {selectedProduct.stock_quantity}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                                <CardDescription>
                                    Enter customer details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="client_name">Client Name</Label>
                                    <Input
                                        id="client_name"
                                        value={data.client_name}
                                        onChange={(e) => setData('client_name', e.target.value)}
                                    />
                                    {errors.client_name && (
                                        <p className="text-sm text-destructive mt-1">{errors.client_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="client_phone">Phone Number</Label>
                                    <Input
                                        id="client_phone"
                                        value={data.client_phone}
                                        onChange={(e) => setData('client_phone', e.target.value)}
                                    />
                                    {errors.client_phone && (
                                        <p className="text-sm text-destructive mt-1">{errors.client_phone}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-destructive mt-1">{errors.city}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-destructive mt-1">{errors.address}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pricing Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing Information</CardTitle>
                            <CardDescription>
                                Set pricing and calculate profit
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="sale_price">Sale Price (MAD)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        value={data.sale_price}
                                        onChange={(e) => handlePriceChange('sale_price', e.target.value)}
                                    />
                                    {errors.sale_price && (
                                        <p className="text-sm text-destructive mt-1">{errors.sale_price}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="shipping_cost">Shipping Cost (MAD)</Label>
                                    <Input
                                        id="shipping_cost"
                                        type="number"
                                        step="0.01"
                                        value={data.shipping_cost}
                                        onChange={(e) => handlePriceChange('shipping_cost', e.target.value)}
                                    />
                                    {errors.shipping_cost && (
                                        <p className="text-sm text-destructive mt-1">{errors.shipping_cost}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="user_profit">User Profit (MAD)</Label>
                                    <Input
                                        id="user_profit"
                                        type="number"
                                        step="0.01"
                                        value={data.user_profit}
                                        onChange={(e) => setData('user_profit', e.target.value)}
                                    />
                                    {errors.user_profit && (
                                        <p className="text-sm text-destructive mt-1">{errors.user_profit}</p>
                                    )}
                                </div>
                            </div>
                            {selectedProduct && data.sale_price && data.shipping_cost && (
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium">Profit Calculation:</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sale Price: {data.sale_price} MAD - Product Cost: {Number(selectedProduct.price).toFixed(2)} MAD - Shipping: {data.shipping_cost} MAD = Profit: {data.user_profit} MAD
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>
                                Optional order details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="tracking_number">Tracking Number</Label>
                                    <Input
                                        id="tracking_number"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number', e.target.value)}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                                    <Input
                                        id="estimated_delivery"
                                        type="date"
                                        value={data.estimated_delivery}
                                        onChange={(e) => setData('estimated_delivery', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Add any additional notes about this order..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.orders.index')}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Plus className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
