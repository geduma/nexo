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
      t("catalog.whatsappMessage", { name: product.name, price: product.priceSale.toLocaleString() })
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <Paper
      radius="lg"
      withBorder
      style={{
        overflow: "hidden",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={() => onViewDetails?.(product.id)}
    >
      <Box style={{ position: "relative", overflow: "hidden" }}>
        {product.primaryImageUrl ? (
          <Box
            component="img"
            src={product.primaryImageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            w="100%"
            h={220}
            style={{ objectFit: "cover", transition: "transform 300ms ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        ) : (
          <Box
            w="100%"
            h={220}
            style={{
              background: "linear-gradient(135deg, var(--mantine-color-gray-1) 0%, var(--mantine-color-gray-2) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text c="dimmed" size="sm">{t("common.noData")}</Text>
          </Box>
        )}
        <Badge
          color={product.availabilityStatus === "IN_STOCK" ? "green" : "yellow"}
          size="sm"
          variant="filled"
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          {t(`availability.${product.availabilityStatus}`)}
        </Badge>
      </Box>

      <Stack gap={6} p="md">
        {product.categoryName && (
          <Text size="xs" fw={500} tt="uppercase" c="dimmed" style={{ letterSpacing: 0.5 }}>
            {product.categoryName}
          </Text>
        )}
        <Text fw={600} size="md" truncate maw="100%">
          {product.name}
        </Text>
        <Text fw={700} size="lg" c="blue">
          ${product.priceSale.toLocaleString()}
        </Text>

        <Group gap="xs" mt={4}>
          {product.availabilityStatus === "IN_STOCK" && (
            <Button
              color="blue"
              leftSection={<ShoppingCart size={14} />}
              size="xs"
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
                notifications.show({
                  message: t("catalog.pendingImplementation"),
                  color: "yellow",
                });
              }}
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
              leftSection={<MessageCircle size={14} />}
              size="xs"
              flex={1}
              onClick={(e) => e.stopPropagation()}
            >
              WhatsApp
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
