import { useNavigate, useParams } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductFormComponent } from "../components/product-form";
import { useProduct, useUpdateProduct } from "../hooks/use-products";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch } = useProduct(id!);
  const updateMutation = useUpdateProduct();

  if (isLoading) return <LoadingSkeleton />;
  if (error || !product?.data) return <ErrorState onRetry={refetch} />;

  const p = product.data;

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>{t("products.edit")}</Title>
      <ProductFormComponent
        defaultValues={{
          categoryId: p.categoryId,
          name: p.name,
          description: p.description ?? undefined,
          priceCost: p.priceCost,
          priceSale: p.priceSale,
          availabilityStatus: p.availabilityStatus,
          supplierInfo: p.supplierInfo ?? undefined,
          isFeatured: p.isFeatured,
          isVisible: p.isVisible,
        }}
        onSubmit={(data) =>
          updateMutation.mutate(
            { id: id!, data: data as never },
            { onSuccess: () => navigate("/products") }
          )
        }
        loading={updateMutation.isPending}
      />
    </Stack>
  );
}
