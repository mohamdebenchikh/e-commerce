export interface EarningsData {
  date: string;
  earnings: number;
  orders: number;
  commission: number;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  requestDate: string;
  status: "pending" | "approved" | "paid" | "rejected";
  method: "bank" | "cashplus";
  notes?: string;
  processedDate?: string;
}

export interface Transaction {
  id: string;
  type: "earning" | "payment" | "commission";
  amount: number;
  date: string;
  description: string;
  orderId?: string;
  status: "completed" | "pending" | "failed";
}

// Mock earnings data for the last 12 months
export const monthlyEarnings: EarningsData[] = [
  { date: "2024-01", earnings: 850, orders: 12, commission: 340 },
  { date: "2024-02", earnings: 1200, orders: 18, commission: 480 },
  { date: "2024-03", earnings: 950, orders: 14, commission: 380 },
  { date: "2024-04", earnings: 1450, orders: 22, commission: 580 },
  { date: "2024-05", earnings: 1100, orders: 16, commission: 440 },
  { date: "2024-06", earnings: 1680, orders: 25, commission: 672 },
  { date: "2024-07", earnings: 1350, orders: 20, commission: 540 },
  { date: "2024-08", earnings: 1850, orders: 28, commission: 740 },
  { date: "2024-09", earnings: 1750, orders: 26, commission: 700 },
  { date: "2024-10", earnings: 2100, orders: 32, commission: 840 },
  { date: "2024-11", earnings: 1950, orders: 29, commission: 780 },
  { date: "2024-12", earnings: 2300, orders: 35, commission: 920 },
];

// Mock daily earnings for current month
export const dailyEarnings: EarningsData[] = [
  { date: "2024-12-01", earnings: 120, orders: 2, commission: 48 },
  { date: "2024-12-02", earnings: 85, orders: 1, commission: 34 },
  { date: "2024-12-03", earnings: 200, orders: 3, commission: 80 },
  { date: "2024-12-04", earnings: 150, orders: 2, commission: 60 },
  { date: "2024-12-05", earnings: 300, orders: 4, commission: 120 },
  { date: "2024-12-06", earnings: 180, orders: 3, commission: 72 },
  { date: "2024-12-07", earnings: 250, orders: 4, commission: 100 },
  { date: "2024-12-08", earnings: 160, orders: 2, commission: 64 },
  { date: "2024-12-09", earnings: 220, orders: 3, commission: 88 },
  { date: "2024-12-10", earnings: 190, orders: 3, commission: 76 },
  { date: "2024-12-11", earnings: 280, orders: 4, commission: 112 },
  { date: "2024-12-12", earnings: 135, orders: 2, commission: 54 },
  { date: "2024-12-13", earnings: 320, orders: 5, commission: 128 },
  { date: "2024-12-14", earnings: 240, orders: 3, commission: 96 },
  { date: "2024-12-15", earnings: 175, orders: 2, commission: 70 },
];

// Mock payment requests
export const paymentRequests: PaymentRequest[] = [
  {
    id: "PR001",
    amount: 1500,
    requestDate: "2024-12-10T10:30:00Z",
    status: "paid",
    method: "bank",
    processedDate: "2024-12-12T14:20:00Z",
  },
  {
    id: "PR002",
    amount: 800,
    requestDate: "2024-12-08T16:45:00Z",
    status: "approved",
    method: "cashplus",
    processedDate: "2024-12-09T09:15:00Z",
  },
  {
    id: "PR003",
    amount: 1200,
    requestDate: "2024-12-05T11:20:00Z",
    status: "pending",
    method: "bank",
  },
];

// Mock recent transactions
export const recentTransactions: Transaction[] = [
  {
    id: "T001",
    type: "earning",
    amount: 250,
    date: "2024-12-14T15:30:00Z",
    description: "ربح من بيع سجادة مغربية تقليدية",
    orderId: "12347",
    status: "completed",
  },
  {
    id: "T002",
    type: "payment",
    amount: -1500,
    date: "2024-12-12T14:20:00Z",
    description: "تحويل بنكي - طلب رقم PR001",
    status: "completed",
  },
  {
    id: "T003",
    type: "earning",
    amount: 180,
    date: "2024-12-11T12:15:00Z",
    description: "ربح من بيع زيت الأركان العضوي",
    orderId: "12346",
    status: "completed",
  },
  {
    id: "T004",
    type: "commission",
    amount: 75,
    date: "2024-12-10T18:45:00Z",
    description: "عمولة إضافية - مبيعات ممتازة",
    status: "completed",
  },
  {
    id: "T005",
    type: "earning",
    amount: 320,
    date: "2024-12-09T09:30:00Z",
    description: "ربح من بيع قفطان مغربي فاخر",
    orderId: "12345",
    status: "completed",
  },
];

// Earnings summary data
export const earningsSummary = {
  totalEarnings: 18775,
  pendingPayments: 1200,
  availableBalance: 2350,
  thisMonth: 2300,
  lastMonth: 1950,
  growth: ((2300 - 1950) / 1950) * 100,
  totalOrders: 290,
  averageOrderValue: 64.7,
  conversionRate: 8.5,
};
