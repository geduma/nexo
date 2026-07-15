import { useState } from "react";
import { Box, Stack, Title, SimpleGrid, Modal, Text, Badge, Group, Button, ActionIcon, Flex } from "@mantine/core";
import { X, ChevronLeft, ChevronRight, MessageCircle, ShoppingCart } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { EmptyState } from "../../../components/common/empty-state";
import { useDebounce } from "../../../hooks/use-debounce";
import { CatalogHeader } from "../components/catalog-header";
import { CatalogSearch } from "../components/catalog-search";
import { CategoryFilter } from "../components/category-filter";
import { ProductCard } from "../components/product-card";
import { CatalogFooter } from "../components/catalog-footer";

interface CatalogProduct {
  id: string;
  name: string;
  categoryName: string;
  priceSale: number;
  availabilityStatus: "IN_STOCK" | "CHECK_SUPPLIER";
  primaryImageUrl: string | null;
  isFeatured: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Settings {
  businessName: string;
  whatsappNumber: string;
  logoUrl: string | null;
}

export function CatalogHomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data: settings } = useQuery<{ data: Settings }>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiClient.get("/settings");
      return response.data;
    },
  });

  const { data: categoriesData } = useQuery<{ data: Category[] }>({
    queryKey: ["catalog-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/categories?limit=100");
      return response.data;
    },
  });

  const { data: products, isLoading } = useQuery<{ data: CatalogProduct[] }>({
    queryKey: ["catalog-products", debouncedSearch, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({ visible: "true", limit: "50" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (selectedCategory) params.set("category", selectedCategory);
      const response = await apiClient.get(`/products?${params}`);
      return response.data;
    },
  });

  const settingsData = settings?.data;
  const allProducts = products?.data ?? [];
  const featuredProducts = allProducts.filter((p) => p.isFeatured);
  const categories = categoriesData?.data ?? [];

  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);

  const { data: detailData } = useQuery<{
    data: {
      name: string;
      description: string | null;
      priceSale: number;
      availabilityStatus: string;
      images: Array<{ id: string; imageUrl: string; isPrimary: boolean }>;
    };
  }>({
    queryKey: ["product-detail", detailProductId],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${detailProductId}`);
      return response.data;
    },
    enabled: !!detailProductId,
  });

  const detailProduct = detailData?.data;
  const detailImages = detailProduct?.images ?? [];

  const openDetail = (id: string) => {
    setDetailProductId(id);
    setDetailImageIndex(0);
  };

  const closeDetail = () => {
    setDetailProductId(null);
    setDetailImageIndex(0);
  };

  return (
    <Box p="md">
      <Stack gap="lg" maw={1200} mx="auto">
        <CatalogHeader
          businessName={settingsData?.businessName ?? t("app.name")}
          logoUrl={settingsData?.logoUrl}
        />

        <Flex gap="md" align="center" justify="center" wrap="wrap">
          <CatalogSearch value={search} onChange={setSearch} />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </Flex>

        {isLoading ? (
          <LoadingSkeleton />
        ) : allProducts.length === 0 ? (
          <EmptyState
            title={t("catalog.noProducts")}
            description={t("products.noProductsDescription")}
          />
        ) : (
          <Stack gap="xl">
            {selectedCategory === null && featuredProducts.length > 0 && (
              <div>
                <Title order={3} mb="md" ta="center">{t("catalog.featured")}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      whatsappNumber={settingsData?.whatsappNumber}
                      onViewDetails={openDetail}
                    />
                  ))}
                </SimpleGrid>
              </div>
            )}

            <div>
              <Title order={3} mb="md" ta="center">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : t("catalog.allProducts")}
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                {(selectedCategory
                  ? allProducts
                  : allProducts.filter((p) => !p.isFeatured)
                ).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={settingsData?.whatsappNumber}
                    businessName={settingsData?.businessName}
                    onViewDetails={openDetail}
                  />
                ))}
              </SimpleGrid>
            </div>
          </Stack>
        )}

        <CatalogFooter businessName={settingsData?.businessName ?? t("app.name")} />
      </Stack>

      <Modal
        opened={!!detailProductId}
        onClose={closeDetail}
        size="lg"
        padding={0}
        withCloseButton={false}
      >
        {detailProduct && (
          <Box style={{ position: "relative" }}>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={closeDetail}
              style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            >
              <X size={20} />
            </ActionIcon>

            {detailImages.length > 0 && (
              <Box style={{ position: "relative" }}>
                <Box
                  component="img"
                  src={detailImages[detailImageIndex]?.imageUrl}
                  alt={detailProduct.name}
                  w="100%"
                  h={400}
                  style={{ objectFit: "cover" }}
                />
                {detailImages.length > 1 && (
                  <>
                    <ActionIcon
                      variant="filled"
                      color="dark"
                      style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setDetailImageIndex((i) => (i === 0 ? detailImages.length - 1 : i - 1))}
                    >
                      <ChevronLeft size={20} />
                    </ActionIcon>
                    <ActionIcon
                      variant="filled"
                      color="dark"
                      style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setDetailImageIndex((i) => (i === detailImages.length - 1 ? 0 : i + 1))}
                    >
                      <ChevronRight size={20} />
                    </ActionIcon>
                    <Group justify="center" gap={4} pt={4} pb="sm">
                      {detailImages.map((_, idx) => (
                        <Box
                          key={idx}
                          w={8}
                          h={8}
                          style={{
                            borderRadius: "50%",
                            backgroundColor: idx === detailImageIndex ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-4)",
                            cursor: "pointer",
                          }}
                          onClick={() => setDetailImageIndex(idx)}
                        />
                      ))}
                    </Group>
                  </>
                )}
              </Box>
            )}

            <Stack p="md" gap="xs">
              <Text fw={700} size="lg">{detailProduct.name}</Text>
              <Text fw={600} size="xl">${detailProduct.priceSale.toLocaleString()}</Text>
              <Badge
                color={detailProduct.availabilityStatus === "IN_STOCK" ? "green" : "yellow"}
                w="fit-content"
              >
                {t(`availability.${detailProduct.availabilityStatus}`)}
              </Badge>
              {detailProduct.description && (
                <Text size="sm" c="dimmed">{detailProduct.description}</Text>
              )}
              <Group mt="sm" grow>
                {detailProduct.availabilityStatus === "IN_STOCK" && (
                  <Button
                    color="blue"
                    leftSection={<ShoppingCart size={16} />}
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
                  <Button
                    component="a"
                    href={`https://wa.me/${settingsData.whatsappNumber}?text=${encodeURIComponent(
                      `Hola, me interesa el producto: ${detailProduct.name} - $${detailProduct.priceSale.toLocaleString()} (ref: ${window.location.origin}/product/${detailProductId})`
                    )}`}
                    target="_blank"
                    color="green"
                    leftSection={<MessageCircle size={16} />}
                  >
                    {t("catalog.whatsappButton")}
                  </Button>
                )}
              </Group>
            </Stack>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
