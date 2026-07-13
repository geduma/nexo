import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Paper, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface DailySalesChartProps {
  data: Array<{ date: string; count: number; revenue: number }>;
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  const { t } = useTranslation();

  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">{t("reports.salesTrend")}</Title>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--mantine-color-dimmed)" }}>
          {t("reports.noData")}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#40c057" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
