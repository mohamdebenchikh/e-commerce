import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { Order, type BreadcrumbItem } from '@/types';
import { Edit, ArrowLeft, Package, User, MapPin, Phone, Calendar, DollarSign, Truck, Clock, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('orders'), href: route('admin.orders.index') },
        { title: `Order #${order.id}`, href: route('admin.orders.show', order.id) },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return Clock;
            case 'confirmed': return Package;
            case 'shipped': return Truck;
            case 'delivered': return CheckCircle;
            case 'cancelled': return X;
            default: return Clock;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'confirmed': return 'default';
            case 'shipped': return 'default';
            case 'delivered': return 'success' as any;
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const handleStatusUpdate = () => {
        const data: any = { status: newStatus };
        if (newStatus === 'shipped' && trackingNumber) {
            data.tracking_number = trackingNumber;
        }

        router.patch(route('admin.orders.update-status', order.id), data, {
            onSuccess: () => {
                toast.success('Order status updated successfully');
                setIsStatusDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to update order status');
            }
        });
    };

    const StatusIcon = getStatusIcon(order.status);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
                            <p className="text-muted-foreground">
                                Created on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    Update Status
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Order Status</DialogTitle>
                                    <DialogDescription>
                                        Change the status of this order
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
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
                                    {newStatus === 'shipped' && (
                                        <div>
                                            <Label htmlFor="tracking">Tracking Number</Label>
                                            <Input
                                                id="tracking"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Enter tracking number"
                                            />
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleStatusUpdate}>
                                        Update Status
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button asChild>
                            <Link href={route('admin.orders.edit', order.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {trans('edit_order')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <StatusIcon className="h-5 w-5" />
                                Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={getStatusVariant(order.status)} className="text-sm">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            {order.tracking_number && (
                                <div className="mt-4">
                                    <Label className="text-sm font-medium">Tracking Number</Label>
                                    <p className="text-sm text-muted-foreground">{order.tracking_number}</p>
                                </div>
                            )}
                            {order.estimated_delivery && (
                                <div className="mt-4">
                                    <Label className="text-sm font-medium">Estimated Delivery</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.estimated_delivery).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Name</Label>
                                <p className="text-sm text-muted-foreground">{order.client_name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    Phone
                                </Label>
                                <p className="text-sm text-muted-foreground">{order.client_phone}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Address
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {order.address}, {order.city}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Financial Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium">Sale Price</Label>
                                <p className="text-sm font-semibold">{order.sale_price.toFixed(2)} MAD</p>
                            </div>
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium">Shipping Cost</Label>
                                <p className="text-sm">{order.shipping_cost.toFixed(2)} MAD</p>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium">User Profit</Label>
                                <p className="text-sm font-semibold text-green-600">
                                    {order.user_profit.toFixed(2)} MAD
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product and User Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.product ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Product Name</Label>
                                        <p className="text-sm text-muted-foreground">{order.product.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">SKU</Label>
                                        <p className="text-sm text-muted-foreground">{order.product.sku}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Base Price</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {order.product.price.toFixed(2)} MAD
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Product information not available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Seller Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.user ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Name</Label>
                                        <p className="text-sm text-muted-foreground">{order.user.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">User information not available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {order.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
