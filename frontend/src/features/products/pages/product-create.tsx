import { useNavigate } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductFormComponent } from "../components/product-form";
import { useCreateProduct } from "../hooks/use-products";
import { useUploadImage } from "../hooks/use-images";
import { apiClient } from "../../../services/api/client";
import type { ImageFile } from "../../../components/common/image-upload";

export function ProductCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = async (data: Record<string, unknown>, imageFiles?: ImageFile[]) => {
    createMutation.mutate(data as never, {
      onSuccess: async (response: unknown) => {
        const res = response as { data?: { data?: { id: string }; id: string } };
        const productId = res?.data?.data?.id ?? res?.data?.id;
        if (productId && imageFiles && imageFiles.length > 0) {
          for (const img of imageFiles) {
            if (img.file) {
              const formData = new FormData();
              formData.append("file", img.file);
              formData.append("displayOrder", String(img.displayOrder));
              formData.append("isPrimary", String(img.isPrimary));
              try {
                await apiClient.post(`/products/${productId}/images`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
              } catch {
                // fallback: ignore individual image upload errors
              }
            }
          }
        }
        navigate("/products");
      },
    });
  };

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>{t("products.create")}</Title>
      <ProductFormComponent
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </Stack>
  );
}
