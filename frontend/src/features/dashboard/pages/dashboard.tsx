import { Stack, Title, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../../reports/hooks/use-reports";
import { useSales } from "../../sales/hooks/use-sales";
import { StatCards } from "../components/stat-cards";
import { RevenueChart } from "../components/charts/revenue-chart";
import { DailySalesChart } from "../components/charts/daily-sales-chart";
import { TopProductsChart } from "../components/charts/top-products-chart";
import { RecentSales } from "../components/recent-sales";
import { QuickActions } from "../components/quick-actions";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";

export function DashboardPage() {
  const { t } = useTranslation();
  const { data: reportData, isLoading, error, refetch } = useDashboardData();
  const { data: salesData } = useSales({ limit: 5 });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;

  const recentSales = (salesData?.data ?? []).map((s) => ({
    id: s.id,
    productName: s.productName ?? "-",
    customerName: s.customerName,
    quantity: s.quantity,
    salePrice: s.salePrice,
    saleDate: s.saleDate,
  }));

  return (
    <Stack gap="lg">
      <Title order={2}>{t("dashboard.title")}</Title>

      <StatCards
        totalProducts={reportData?.totalProducts ?? 0}
        totalSales={reportData?.totalSales}
        totalRevenue={reportData?.totalRevenue}
        averageSale={reportData?.averageSale}
      />

      <QuickActions />

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <RevenueChart data={reportData?.salesByDay ?? []} />
        <DailySalesChart data={reportData?.salesByDay ?? []} />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <TopProductsChart data={reportData?.topProducts ?? []} />
        <RecentSales sales={recentSales} />
      </SimpleGrid>
    </Stack>
  );
}
