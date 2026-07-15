import { useParams, Link } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Box,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { WhatsAppButton } from "../components/whatsapp-button";
import { RelatedProducts } from "../components/related-products";

interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface CatalogProductDetail {
  id: string;
  name: string;
  description: string | null;
  categoryName: string;
  priceSale: number;
  availabilityStatus: "IN_STOCK" | "CHECK_SUPPLIER";
  images: ProductImage[];
}

interface Settings {
  whatsappNumber: string;
  businessName: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  priceSale: number;
  availabilityStatus: "IN_STOCK" | "CHECK_SUPPLIER";
  primaryImageUrl: string | null;
}

export function CatalogProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: settings } = useQuery<{ data: Settings }>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiClient.get("/settings");
      return response.data;
    },
  });

  const { data: product, isLoading } = useQuery<{ data: CatalogProductDetail }>({
    queryKey: ["catalog-product", id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: relatedData } = useQuery<{ data: RelatedProduct[] }>({
    queryKey: ["catalog-related", id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}/related`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!product?.data) return null;

  const p = product.data;
  const settingsData = settings?.data;

  return (
    <Box p="md">
      <Stack gap="lg" maw={800} mx="auto">
        <Button
          component={Link}
          to="/"
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
        >
          {t("catalog.backToCatalog")}
        </Button>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Box>
            {p.images && p.images.length > 0 && (
              <Box
                component="img"
                src={p.images.find((img) => img.isPrimary)?.imageUrl ?? p.images[0]?.imageUrl}
                alt={p.name}
                w="100%"
                h={400}
                style={{ objectFit: "cover", borderRadius: "var(--mantine-radius-lg)" }}
              />
            )}
          </Box>

          <Stack gap="md">
            <Title order={2}>{p.name}</Title>

            <Group>
              <Badge color="blue">{p.categoryName}</Badge>
              <Badge color={p.availabilityStatus === "IN_STOCK" ? "green" : "yellow"}>
                {t(`availability.${p.availabilityStatus}`)}
              </Badge>
            </Group>

            <Text fw={700} size="xl">${p.priceSale.toLocaleString()}</Text>

            {p.description && (
              <Text size="sm" c="dimmed">{p.description}</Text>
            )}

            {p.availabilityStatus === "IN_STOCK" && (
              <Button
                color="blue"
                leftSection={<ShoppingCart size={16} />}
                fullWidth
                size="lg"
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

            {settingsData?.whatsappNumber && (
              <WhatsAppButton
                productName={p.name}
                price={p.priceSale}
                whatsappNumber={settingsData.whatsappNumber}
                availabilityStatus={p.availabilityStatus}
              />
            )}
          </Stack>
        </SimpleGrid>

        <Divider />

        {relatedData?.data && relatedData.data.length > 0 && (
          <RelatedProducts
            products={relatedData.data}
            whatsappNumber={settingsData?.whatsappNumber}
          />
        )}
      </Stack>
    </Box>
  );
}
