import { Title, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductCard } from "./product-card";

interface RelatedProduct {
  id: string;
  name: string;
  priceSale: number;
  availabilityStatus: "IN_STOCK" | "CHECK_SUPPLIER";
  primaryImageUrl?: string | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  whatsappNumber?: string;
}

export function RelatedProducts({ products, whatsappNumber }: RelatedProductsProps) {
  const { t } = useTranslation();

  if (products.length === 0) return null;

  return (
    <div>
      <Title order={4} mb="md">{t("catalog.relatedProducts")}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
        ))}
      </SimpleGrid>
    </div>
  );
}
