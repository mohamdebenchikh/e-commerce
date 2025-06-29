import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from "@/components/ui/custom-buttons";
import {
  monthlyEarnings,
  dailyEarnings,
  paymentRequests,
  recentTransactions,
  earningsSummary,
  PaymentRequest,
} from "@/data/earnings";

export default function Earnings() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [timeRange, setTimeRange] = useState("monthly");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cashplus">(
    user?.paymentMethod || "bank",
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chartData = timeRange === "daily" ? dailyEarnings : monthlyEarnings;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-MA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-MA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "approved":
        return "معتمد";
      case "pending":
        return "في الانتظار";
      case "rejected":
        return "مرفوض";
      case "completed":
        return "مكتمل";
      case "failed":
        return "فاشل";
      default:
        return status;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "payment":
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      case "commission":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const handlePaymentRequest = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح",
      });
      return;
    }

    if (parseFloat(paymentAmount) > earningsSummary.availableBalance) {
      toast({
        variant: "destructive",
        title: "رصيد غير كافي",
        description: "المبلغ المطلوب أكبر من رصيدك المتاح",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "تم إرسال طلب الدفع",
        description: `تم إرسال طلب دفع بقيمة ${formatPrice(parseFloat(paymentAmount))} بنجاح. سيتم مراجعته خلال 24 ساعة.`,
      });

      setIsPaymentDialogOpen(false);
      setPaymentAmount("");
      setPaymentNotes("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلب الدفع",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple chart component using CSS
  const SimpleBarChart = ({ data }: { data: typeof chartData }) => {
    const maxEarning = Math.max(...data.map((d) => d.earnings));

    return (
      <div className="space-y-2">
        {data.slice(-10).map((item, index) => (
          <div key={item.date} className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-16">
              {timeRange === "daily"
                ? new Date(item.date).getDate()
                : new Date(item.date + "-01").toLocaleDateString("ar-MA", {
                    month: "short",
                  })}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div
                className="h-6 bg-primary/20 rounded flex items-center justify-end pr-2"
                style={{
                  width: `${(item.earnings / maxEarning) * 100}%`,
                  minWidth: "20px",
                }}
              >
                <div className="text-xs font-medium text-primary">
                  {formatPrice(item.earnings)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const stats = [
    {
      title: "الرصيد المتاح",
      value: formatPrice(earningsSummary.availableBalance),
      icon: DollarSign,
      change: `+${earningsSummary.growth.toFixed(1)}%`,
      changeType: "positive",
      color: "text-green-600",
    },
    {
      title: "إجمالي الأرباح",
      value: formatPrice(earningsSummary.totalEarnings),
      icon: TrendingUp,
      change: "هذا الشهر",
      changeType: "neutral",
      color: "text-blue-600",
    },
    {
      title: "طلبات معلقة",
      value: formatPrice(earningsSummary.pendingPayments),
      icon: Clock,
      change: "في المراجعة",
      changeType: "neutral",
      color: "text-yellow-600",
    },
    {
      title: "هذا الشهر",
      value: formatPrice(earningsSummary.thisMonth),
      icon: Calendar,
      change: `+${(((earningsSummary.thisMonth - earningsSummary.lastMonth) / earningsSummary.lastMonth) * 100).toFixed(1)}%`,
      changeType: "positive",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            الأرباح والمدفوعات
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            تتبع أرباحك واطلب المدفوعات
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <SecondaryButton className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </SecondaryButton>
          <Dialog
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
          >
            <DialogTrigger asChild>
              <PrimaryButton className="flex-1 sm:flex-none">
                <CreditCard className="w-4 h-4 ml-2" />
                طلب دفع
              </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>طلب دفع جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">
                        الرصيد المتاح:
                      </span>
                      <span className="font-bold text-blue-900">
                        {formatPrice(earningsSummary.availableBalance)}
                      </span>
                    </div>
                  </div>

                  {user?.paymentMethod === "bank" && user?.bankName && (
                    <div className="p-3 bg-green-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-800">البنك المحدد:</span>
                        <span className="font-medium text-green-900">
                          {user.bankName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ المطلوب *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="أدخل المبلغ"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label>طريقة الدفع *</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as "bank" | "cashplus")
                    }
                  >
                    <div className="flex items-center space-x-reverse space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer">
                        تحويل بنكي
                      </Label>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <RadioGroupItem value="cashplus" id="cashplus" />
                      <Label htmlFor="cashplus" className="cursor-pointer">
                        Cash Plus
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                  <Textarea
                    id="notes"
                    placeholder="ملاحظات إضافية..."
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="text-right resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <SecondaryButton
                    className="flex-1"
                    onClick={() => setIsPaymentDialogOpen(false)}
                  >
                    إلغاء
                  </SecondaryButton>
                  <PrimaryButton
                    className="flex-1"
                    onClick={handlePaymentRequest}
                    loading={isLoading}
                  >
                    إرسال الطلب
                  </PrimaryButton>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-moroccan transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div
                      className={`flex items-center mt-1 text-xs sm:text-sm ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stat.changeType === "positive" && (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      )}
                      {stat.changeType === "negative" && (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <Icon
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color} self-end sm:self-center`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              تطور الأرباح
            </CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">يومي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData} />
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(
                      chartData.reduce((sum, item) => sum + item.earnings, 0) /
                        chartData.length,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    متوسط الأرباح
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(
                      chartData.reduce((sum, item) => sum + item.orders, 0) /
                        chartData.length,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    متوسط الطلبات
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(
                      chartData.reduce(
                        (sum, item) => sum + item.commission,
                        0,
                      ) / chartData.length,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    متوسط العمولة
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Requests */}
        <Card>
          <CardHeader>
            <CardTitle>طلبات الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    لا توجد طلبات دفع
                  </p>
                </div>
              ) : (
                paymentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                      <span className="font-bold text-primary">
                        {formatPrice(request.amount)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>الطلب: {request.id}</div>
                      <div>التاريخ: {formatDate(request.requestDate)}</div>
                      <div>
                        الطريقة:{" "}
                        {request.method === "bank" ? "بنكي" : "Cash Plus"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>المعاملات الأخيرة</CardTitle>
          <Link to="/dashboard/transactions">
            <SecondaryButton size="sm">
              <Eye className="w-4 h-4 ml-2" />
              عرض الكل
            </SecondaryButton>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {formatPrice(Math.abs(transaction.amount))}
                  </p>
                  <Badge className={getStatusColor(transaction.status)}>
                    {getStatusText(transaction.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              إحصائيات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  إجمالي الطلبات
                </span>
                <span className="font-bold">{earningsSummary.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  متوسط قيمة الطلب
                </span>
                <span className="font-bold">
                  {formatPrice(earningsSummary.averageOrderValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  معدل التحويل
                </span>
                <span className="font-bold">
                  {earningsSummary.conversionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  نمو الأرباح
                </span>
                <span className="font-bold text-green-600">
                  +{earningsSummary.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نصائح لزيادة الأرباح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">
                  ركز على المنتجات عالية العمولة
                </h4>
                <p className="text-xs text-blue-700">
                  المنتجات ذات العمولة 30% فما فوق تحقق أرباح أكبر
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 text-sm mb-1">
                  استخدم وسائل التواصل بفعالية
                </h4>
                <p className="text-xs text-green-700">
                  المشاركة على WhatsApp وFacebook تزيد المبيعات بـ 40%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 text-sm mb-1">
                  اطلب الدفع بانتظام
                </h4>
                <p className="text-xs text-orange-700">
                  اطلب د��عاتك كل أسبوعين للحفاظ على سيولة جيدة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
