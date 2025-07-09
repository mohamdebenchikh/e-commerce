import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { Order, type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface OrderEditProps {
    order: Order;
}

export default function OrderEdit({ order }: OrderEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        client_name: order.client_name,
        city: order.city,
        address: order.address,
        client_phone: order.client_phone,
        shipping_cost: order.shipping_cost.toString(),
        sale_price: order.sale_price.toString(),
        user_profit: order.user_profit.toString(),
        status: order.status,
        notes: order.notes || '',
        tracking_number: order.tracking_number || '',
        estimated_delivery: order.estimated_delivery ? order.estimated_delivery.split('T')[0] : '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('orders'), href: route('admin.orders.index') },
        { title: `Order #${order.id}`, href: route('admin.orders.show', order.id) },
        { title: trans('edit'), href: route('admin.orders.edit', order.id) },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.orders.update', order.id), {
            onSuccess: () => {
                toast.success('Order updated successfully');
            },
            onError: () => {
                toast.error('Failed to update order');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order #${order.id}`} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.orders.show', order.id)}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back_to_order')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Order #{order.id}</h1>
                            <p className="text-muted-foreground">
                                Update order information and status
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                                <CardDescription>
                                    Update customer details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="client_name">Client Name</Label>
                                    <Input
                                        id="client_name"
                                        value={data.client_name}
                                        onChange={(e) => setData('client_name', e.target.value)}
                                        error={errors.client_name}
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
                                        error={errors.client_phone}
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
                                        error={errors.city}
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

                        {/* Order Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                                <CardDescription>
                                    Update pricing and status information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="sale_price">Sale Price (MAD)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        error={errors.sale_price}
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
                                        onChange={(e) => setData('shipping_cost', e.target.value)}
                                        error={errors.shipping_cost}
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
                                        error={errors.user_profit}
                                    />
                                    {errors.user_profit && (
                                        <p className="text-sm text-destructive mt-1">{errors.user_profit}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
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
                                    {errors.status && (
                                        <p className="text-sm text-destructive mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>
                                Optional tracking and delivery information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tracking_number">Tracking Number</Label>
                                    <Input
                                        id="tracking_number"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number', e.target.value)}
                                        placeholder="Enter tracking number"
                                    />
                                    {errors.tracking_number && (
                                        <p className="text-sm text-destructive mt-1">{errors.tracking_number}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                                    <Input
                                        id="estimated_delivery"
                                        type="date"
                                        value={data.estimated_delivery}
                                        onChange={(e) => setData('estimated_delivery', e.target.value)}
                                    />
                                    {errors.estimated_delivery && (
                                        <p className="text-sm text-destructive mt-1">{errors.estimated_delivery}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    placeholder="Add any additional notes about this order..."
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive mt-1">{errors.notes}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.orders.show', order.id)}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
