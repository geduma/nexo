import { Paper, Title, Stack, Text, Group, Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Sale {
  id: string;
  productName: string;
  customerName: string;
  quantity: number;
  salePrice: number;
  saleDate: string;
}

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  const { t } = useTranslation();

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">{t("dashboard.recentSales")}</Title>
      {sales.length === 0 ? (
        <Text c="dimmed" size="sm">{t("common.noData")}</Text>
      ) : (
        <Stack gap="sm">
          {sales.map((sale) => (
            <Group key={sale.id} justify="space-between">
              <div>
                <Text size="sm" fw={500}>{sale.customerName}</Text>
                <Text size="xs" c="dimmed">{sale.productName}</Text>
              </div>
              <Group gap="xs">
                <Text size="sm" fw={600}>${sale.salePrice.toLocaleString()}</Text>
                <Badge size="xs" color="gray">x{sale.quantity}</Badge>
              </Group>
            </Group>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
