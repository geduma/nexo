import { SimpleGrid, Paper, Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function QuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      label: t("dashboard.newProduct"),
      icon: <Plus size={16} />,
      onClick: () => navigate("/products/create"),
      color: "blue",
    },
    {
      label: t("dashboard.registerSale"),
      icon: <ShoppingCart size={16} />,
      onClick: () => navigate("/sales/create"),
      color: "green",
    },
    {
      label: t("dashboard.generatePost"),
      icon: <Share2 size={16} />,
      onClick: () => navigate("/social"),
      color: "violet",
    },
  ];

  return (
    <Paper p="md" withBorder>
      <Text fw={600} mb="md">{t("dashboard.quickActions")}</Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="light"
            color={action.color}
            leftSection={action.icon}
            onClick={action.onClick}
            fullWidth
          >
            {action.label}
          </Button>
        ))}
      </SimpleGrid>
    </Paper>
  );
}
