import { useState } from "react";
import { Stack, Title, SimpleGrid, Paper, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useReportSummary, useTopProducts, useDailySales } from "../hooks/use-reports";
import { RevenueChart } from "../../dashboard/components/charts/revenue-chart";
import { DailySalesChart } from "../../dashboard/components/charts/daily-sales-chart";
import { TopProductsChart } from "../../dashboard/components/charts/top-products-chart";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";

export function ReportsPage() {
  const { t } = useTranslation();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const dateRange = {
    from: dateFrom || undefined,
    to: dateTo || undefined,
  };

  const { data: summary, isLoading, error, refetch } = useReportSummary(dateRange);
  const { data: topProducts } = useTopProducts(dateRange);
  const { data: dailySales } = useDailySales(dateRange);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <Stack gap="lg" aria-label={t("reports.title")}>
      <Title order={2}>{t("reports.title")}</Title>

      <Paper p="md" radius="md" withBorder component="section" aria-label="Date range filter">
        <Stack gap="md">
          <Title order={5}>{t("reports.dateRange")}</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              type="date"
              label={t("reports.dateFrom")}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.currentTarget.value)}
              aria-label="Date from"
            />
            <TextInput
              type="date"
              label={t("reports.dateTo")}
              value={dateTo}
              onChange={(e) => setDateTo(e.currentTarget.value)}
              aria-label="Date to"
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} component="section" aria-label="Report summary">
        <Paper p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">{t("reports.revenue")}</Text>
          <Text fw={700} size="xl">${(summary?.totalRevenue ?? 0).toLocaleString()}</Text>
        </Paper>
        <Paper p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">{t("reports.salesCount")}</Text>
          <Text fw={700} size="xl">{summary?.totalSales ?? 0}</Text>
        </Paper>
        <Paper p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">{t("reports.averageTicket")}</Text>
          <Text fw={700} size="xl">${(summary?.averageSale ?? 0).toLocaleString()}</Text>
        </Paper>
        <Paper p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">{t("reports.productsSold")}</Text>
          <Text fw={700} size="xl">{topProducts?.length ?? 0}</Text>
        </Paper>
      </SimpleGrid>

      <RevenueChart data={summary?.salesByDay ?? dailySales ?? []} />
      <DailySalesChart data={summary?.salesByDay ?? dailySales ?? []} />
      <TopProductsChart data={summary?.topProducts ?? topProducts ?? []} />
    </Stack>
  );
}
