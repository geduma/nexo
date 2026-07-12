import { Title, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductCard } from "./product-card";
import type { Product } from "../../../types";

interface FeaturedSectionProps {
  products: Product[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const { t } = useTranslation();

  if (products.length === 0) return null;

  return (
    <div>
      <Title order={3} mb="md" ta="center">{t("catalog.featured")}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </div>
  );
}
