import { useState } from "react";
import { Box, Stack, Title, SimpleGrid } from "@mantine/core";
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

  return (
    <Box p="md">
      <Stack gap="lg" maw={1200} mx="auto">
        <CatalogHeader
          businessName={settingsData?.businessName ?? t("app.name")}
          logoUrl={settingsData?.logoUrl}
        />

        <CatalogSearch value={search} onChange={setSearch} />

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

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
                  />
                ))}
              </SimpleGrid>
            </div>
          </Stack>
        )}

        <CatalogFooter businessName={settingsData?.businessName ?? t("app.name")} />
      </Stack>
    </Box>
  );
}
