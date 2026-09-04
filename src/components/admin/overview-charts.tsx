'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking, Service } from '@/types/database';

interface OverviewChartsProps {
  bookings: (Booking & { service?: Service | null })[];
  services: Service[];
  categoryCounts: Record<string, number>;
}

// Indonesian month labels
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type TimeRangeOption = '7d' | '30d' | '6m';

export function OverviewCharts({
  bookings,
  services,
  categoryCounts,
}: OverviewChartsProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRangeOption>('6m');

  // 1. Prepare dynamic trend data based on selected timeRange
  const trendData = React.useMemo(() => {
    const now = new Date();
    const result = [];

    if (timeRange === '7d') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dayLabel = `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;

        const dayBookings = bookings.filter((b) => {
          const bDate = b.booking_date || b.created_at;
          if (!bDate) return false;
          return bDate.startsWith(dateKey);
        });

        const total = dayBookings.length;
        const confirmed = dayBookings.filter(
          (b) => b.status === 'confirmed' || b.status === 'completed'
        ).length;
        const pending = dayBookings.filter((b) => b.status === 'pending').length;
        const revenue = dayBookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        result.push({
          label: dayLabel,
          shortLabel: `${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`,
          total,
          confirmed,
          pending,
          revenue,
        });
      }
    } else if (timeRange === '30d') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const label = `${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;

        const dayBookings = bookings.filter((b) => {
          const bDate = b.booking_date || b.created_at;
          if (!bDate) return false;
          return bDate.startsWith(dateKey);
        });

        const total = dayBookings.length;
        const confirmed = dayBookings.filter(
          (b) => b.status === 'confirmed' || b.status === 'completed'
        ).length;
        const pending = dayBookings.filter((b) => b.status === 'pending').length;
        const revenue = dayBookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        result.push({
          label,
          shortLabel: label,
          total,
          confirmed,
          pending,
          revenue,
        });
      }
    } else {
      // Last 6 months (default)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        const label = `${MONTH_LABELS[monthIndex]} ${String(year).slice(2)}`;

        const monthBookings = bookings.filter((b) => {
          const dateStr = b.booking_date || b.created_at;
          if (!dateStr) return false;
          return dateStr.startsWith(monthKey);
        });

        const total = monthBookings.length;
        const confirmed = monthBookings.filter(
          (b) => b.status === 'confirmed' || b.status === 'completed'
        ).length;
        const pending = monthBookings.filter((b) => b.status === 'pending').length;
        const revenue = monthBookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        result.push({
          label,
          shortLabel: label,
          total,
          confirmed,
          pending,
          revenue,
        });
      }
    }

    return result;
  }, [bookings, timeRange]);

  // 2. Prepare category breakdown data
  const categoryChartData = React.useMemo(() => {
    const categories = [
      { key: 'travel', name: 'Paket Tour' },
      { key: 'villa', name: 'Villa & Stay' },
      { key: 'surfing-lesson', name: 'Surfing' },
      { key: 'vehicle-rental', name: 'Sewa Kendaraan' },
      { key: 'tattoo', name: 'Tato Studio' },
    ];

    return categories.map((cat) => {
      const activeCatalog = services.filter(
        (s) => s.category === cat.key && s.is_active
      ).length;

      const categoryBookings = bookings.filter((b) => {
        if (b.service?.category) return b.service.category === cat.key;
        return false;
      }).length;

      return {
        category: cat.name,
        activeCatalog,
        bookings: categoryBookings,
        totalCatalog: categoryCounts[cat.key] || 0,
      };
    });
  }, [bookings, services, categoryCounts]);

  // Chart configuration for Monthly/Daily Trend
  const trendConfig: ChartConfig = {
    total: {
      label: 'Semua Booking',
      color: 'var(--chart-1)',
    },
    confirmed: {
      label: 'Terkonfirmasi',
      color: 'var(--chart-2)',
    },
    pending: {
      label: 'Menunggu (Pending)',
      color: 'var(--chart-3)',
    },
  };

  // Chart configuration for Category Distribution
  const categoryConfig: ChartConfig = {
    activeCatalog: {
      label: 'Katalog Aktif',
      color: 'var(--chart-1)',
    },
    bookings: {
      label: 'Volume Booking',
      color: 'var(--chart-2)',
    },
  };

  const getSubTitle = () => {
    switch (timeRange) {
      case '7d':
        return 'Volume pemesanan dan status konfirmasi 7 hari terakhir';
      case '30d':
        return 'Volume pemesanan dan status konfirmasi 30 hari terakhir';
      default:
        return 'Volume pemesanan dan status konfirmasi 6 bulan terakhir';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Dynamic Booking Activity Trend with Filter Dropdown */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Tren Aktivitas Reservasi
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {getSubTitle()}
              </CardDescription>
            </div>

            {/* shadcn Select Dropdown */}
            <Select
              value={timeRange}
              onValueChange={(val) => {
                if (val) setTimeRange(val as TimeRangeOption);
              }}
            >
              <SelectTrigger className="w-[155px] h-8 text-xs bg-background border-border">
                <SelectValue placeholder="Pilih Rentang" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectItem value="7d" className="text-xs">
                    Seminggu Terakhir
                  </SelectItem>
                  <SelectItem value="30d" className="text-xs">
                    Sebulan Terakhir
                  </SelectItem>
                  <SelectItem value="6m" className="text-xs">
                    6 Bulan Terakhir
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={trendConfig} className="h-[260px] w-full">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-confirmed)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-confirmed)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="shortLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={timeRange === '30d' ? 4 : 0}
                className="text-[11px] font-mono"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                className="text-[11px] font-mono"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelKey="label"
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span className="text-muted-foreground text-xs">{name}</span>
                        <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                          {value} reservasi
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
                fillOpacity={0.4}
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={timeRange === '7d'}
              />
              <Area
                dataKey="confirmed"
                type="monotone"
                fill="url(#fillConfirmed)"
                fillOpacity={0.4}
                stroke="var(--color-confirmed)"
                strokeWidth={2}
                dot={timeRange === '7d'}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Category Breakdown & Demand */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Katalog &amp; Permintaan per Kategori
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Perbandingan ketersediaan katalog aktif vs volume reservasi
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground px-2 py-1 rounded bg-muted">
              5 Kategori Layanan
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={categoryConfig} className="h-[260px] w-full">
            <BarChart
              data={categoryChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                className="text-[11px] font-mono"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span className="text-muted-foreground text-xs">{name}</span>
                        <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                          {value} unit
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="activeCatalog"
                fill="var(--color-activeCatalog)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="bookings"
                fill="var(--color-bookings)"
                radius={[4, 4, 0, 0]}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
