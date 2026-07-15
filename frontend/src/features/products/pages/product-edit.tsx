import { useNavigate, useParams } from "react-router-dom";
import { Stack, Title, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductFormComponent } from "../components/product-form";
import { useProduct, useUpdateProduct } from "../hooks/use-products";
import { useProductImages, useUploadImage, useDeleteImage, useSetPrimaryImage } from "../hooks/use-images";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";
import type { ImageFile } from "../../../components/common/image-upload";

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch } = useProduct(id!);
  const updateMutation = useUpdateProduct();
  const { data: imagesData } = useProductImages(id!);
  const uploadMutation = useUploadImage(id!);
  const deleteMutation = useDeleteImage(id!);
  const setPrimaryMutation = useSetPrimaryImage(id!);

  if (isLoading) return <LoadingSkeleton />;
  if (error || !product?.data) return <ErrorState onRetry={refetch} />;

  const p = product.data;

  const existingImages: ImageFile[] = (imagesData?.data ?? []).map((img: { id: string; imageUrl: string; isPrimary: boolean; displayOrder: number }) => ({
    id: img.id,
    preview: img.imageUrl,
    isPrimary: img.isPrimary,
    displayOrder: img.displayOrder,
  }));

  const handleSubmit = async (data: Record<string, unknown>, imageFiles?: ImageFile[]) => {
    updateMutation.mutate(
      { id: id!, data: data as never },
      {
        onSuccess: async () => {
          if (!imageFiles) {
            navigate("/products");
            return;
          }

          const existingIds = new Set(existingImages.map((img) => img.id));
          const toDelete = existingImages.filter((img) => !imageFiles.some((f) => f.id === img.id));
          const toUpload = imageFiles.filter((img) => !img.id && img.file);

          for (const img of toDelete) {
            if (img.id) {
              try { await deleteMutation.mutateAsync(img.id); } catch { /* ignore */ }
            }
          }

          for (const img of imageFiles) {
            if (img.isPrimary && img.id) {
              try { await setPrimaryMutation.mutateAsync(img.id); } catch { /* ignore */ }
            }
          }

          for (const img of toUpload) {
            if (img.file) {
              const formData = new FormData();
              formData.append("file", img.file);
              formData.append("displayOrder", String(img.displayOrder));
              formData.append("isPrimary", String(img.isPrimary));
              try {
                await uploadMutation.mutateAsync(formData);
              } catch { /* ignore */ }
            }
          }

          navigate("/products");
        },
      }
    );
  };

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>{t("products.edit")}</Title>
      <Text size="sm" c="dimmed">{t("products.images")}</Text>
      <ProductFormComponent
        defaultValues={{
          categoryId: p.categoryId,
          name: p.name,
          description: p.description ?? undefined,
          priceCost: p.priceCost,
          priceSale: p.priceSale,
          availabilityStatus: p.availabilityStatus,
          supplierInfo: p.supplierInfo ?? undefined,
          isVisible: p.isVisible,
        }}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
        existingImages={existingImages}
        productId={id}
      />
    </Stack>
  );
}
