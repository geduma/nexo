import { useNavigate } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ProductFormComponent } from "../components/product-form";
import { useCreateProduct } from "../hooks/use-products";

export function ProductCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>{t("products.create")}</Title>
      <ProductFormComponent
        onSubmit={(data) =>
          createMutation.mutate(data as never, {
            onSuccess: () => navigate("/products"),
          })
        }
        loading={createMutation.isPending}
      />
    </Stack>
  );
}
