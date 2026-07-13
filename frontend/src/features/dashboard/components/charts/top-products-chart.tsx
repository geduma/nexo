import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Paper, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface TopProductsChartProps {
  data: Array<{ productName: string; totalQuantity: number; totalRevenue: number }>;
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const { t } = useTranslation();

  return (
    <Paper p="md" radius="md" withBorder>
      <Title order={4} mb="md">{t("reports.topProducts")}</Title>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--mantine-color-dimmed)" }}>
          {t("reports.noData")}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="productName" width={120} />
            <Tooltip />
            <Bar dataKey="totalQuantity" fill="#7950f2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
