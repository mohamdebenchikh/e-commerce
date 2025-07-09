import { Head, usePage } from '@inertiajs/react';
import UserDashboardShellLayout from '@/layouts/user-dashboard-shell-layout';
import { SharedData } from '@/types';
import { trans } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    DollarSign, 
    TrendingUp,
    Package,
    Eye
} from 'lucide-react';

// Mock data - replace with real data from props
const mockStats = {
    totalOrders: 24,
    pendingOrders: 3,
    completedOrders: 21,
    totalSpent: 1250.00
};

const mockRecentOrders = [
    {
        id: 1,
        orderNumber: 'ORD-001',
        date: '2024-01-15',
        status: 'completed',
        total: 89.99,
        items: 2
    },
    {
        id: 2,
        orderNumber: 'ORD-002',
        date: '2024-01-14',
        status: 'pending',
        total: 156.50,
        items: 3
    },
    {
        id: 3,
        orderNumber: 'ORD-003',
        date: '2024-01-12',
        status: 'completed',
        total: 75.25,
        items: 1
    }
];

export default function UserDashboard() {
    const { auth, locale } = usePage<SharedData>().props;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-green-100 text-green-800">{trans('completed')}</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{trans('pending')}</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">{trans('cancelled')}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <UserDashboardShellLayout title="user_dashboard_title">
            <Head title={trans('user_dashboard_title')} />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {trans('user_dashboard_welcome', { name: auth.user?.first_name  || trans('user') })}
                    </h1>
                    <p className="text-muted-foreground">
                        {trans('user_dashboard_welcome_subtitle')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('user_dashboard_total_orders')}
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="inline h-3 w-3 mr-1" />
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('user_dashboard_pending_orders')}
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.pendingOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting processing
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('user_dashboard_completed_orders')}
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.completedOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully delivered
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('user_dashboard_total_spent')}
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {locale === 'ar' ? 'د.م.' : 'MAD'} {mockStats.totalSpent.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total lifetime spending
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{trans('user_dashboard_recent_orders')}</CardTitle>
                                <CardDescription>
                                    Your latest order activity
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                {trans('user_dashboard_view_all_orders')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {mockRecentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {mockRecentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{order.orderNumber}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.date} • {order.items} items
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(order.status)}
                                            <p className="font-medium">
                                                {locale === 'ar' ? 'د.م.' : 'MAD'} {order.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">{trans('user_dashboard_no_orders')}</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't placed any orders yet.
                                </p>
                                <Button>
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    {trans('user_dashboard_start_shopping')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </UserDashboardShellLayout>
    );
}
