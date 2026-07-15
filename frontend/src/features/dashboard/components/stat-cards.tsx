import { SimpleGrid, Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatCardsProps {
  totalProducts?: number;
  totalSales?: number;
  totalRevenue?: number;
  averageSale?: number;
}

export function StatCards({
  totalProducts = 0,
  totalSales = 0,
  totalRevenue = 0,
  averageSale = 0,
}: StatCardsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("dashboard.totalProducts"),
      value: totalProducts,
      icon: <Package size={20} />,
      color: "blue",
    },
    {
      label: t("dashboard.totalSales"),
      value: totalSales,
      icon: <ShoppingCart size={20} />,
      color: "green",
    },
    {
      label: t("dashboard.revenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: "yellow",
    },
    {
      label: t("reports.averageTicket"),
      value: `$${averageSale.toLocaleString()}`,
      icon: <TrendingUp size={20} />,
      color: "violet",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {stats.map((stat) => (
        <Paper key={stat.label} p="md" withBorder>
          <Group>
            <ThemeIcon size="lg" variant="light" color={stat.color}>
              {stat.icon}
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{stat.label}</Text>
              <Text fw={700} size="xl">{stat.value}</Text>
            </div>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
