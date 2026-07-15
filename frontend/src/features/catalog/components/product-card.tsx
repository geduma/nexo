import { Paper, Stack, Text, Badge, Button, Group, Box } from "@mantine/core";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

interface CatalogProductCard {
  id: string;
  name: string;
  priceSale: number;
  availabilityStatus: "IN_STOCK" | "CHECK_SUPPLIER";
  primaryImageUrl?: string | null;
  categoryName?: string;
}

interface ProductCardProps {
  product: CatalogProductCard;
  whatsappNumber?: string;
  businessName?: string;
  onViewDetails?: (productId: string) => void;
}

export function ProductCard({ product, whatsappNumber, onViewDetails }: ProductCardProps) {
  const { t } = useTranslation();

  const getWhatsAppUrl = () => {
    const message = encodeURIComponent(
      `Hola, me interesa el producto: ${product.name} - $${product.priceSale.toLocaleString()}`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="sm">
        {product.primaryImageUrl && (
          <Box
            component="img"
            src={product.primaryImageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            w="100%"
            h={200}
            onClick={() => onViewDetails?.(product.id)}
            style={{ objectFit: "cover", borderRadius: "var(--mantine-radius-md)", cursor: "pointer" }}
          />
        )}
        <Group justify="space-between">
          <Text fw={500} truncate>{product.name}</Text>
          <Badge color={product.availabilityStatus === "IN_STOCK" ? "green" : "yellow"}>
            {t(`availability.${product.availabilityStatus}`)}
          </Badge>
        </Group>
        {product.categoryName && (
          <Text size="xs" c="dimmed">{product.categoryName}</Text>
        )}
        <Text fw={700} size="lg">${product.priceSale.toLocaleString()}</Text>
        {product.availabilityStatus === "IN_STOCK" && (
          <Button
            color="blue"
            leftSection={<ShoppingCart size={16} />}
            fullWidth
            onClick={() =>
              notifications.show({
                message: t("catalog.pendingImplementation"),
                color: "yellow",
              })
            }
          >
            {t("catalog.buyButton")}
          </Button>
        )}
        {whatsappNumber && (
          <Button
            component="a"
            href={getWhatsAppUrl()}
            target="_blank"
            color="green"
            leftSection={<MessageCircle size={16} />}
            fullWidth
          >
            {t("catalog.whatsappButton")}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
