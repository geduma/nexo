import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Select,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import { productSchema, type ProductForm } from "../validations/product.schema";

interface ProductFormComponentProps {
  defaultValues?: Partial<ProductForm>;
  onSubmit: (data: ProductForm) => void;
  loading?: boolean;
}

export function ProductFormComponent({
  defaultValues,
  onSubmit,
  loading = false,
}: ProductFormComponentProps) {
  const { t } = useTranslation();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => {
      const response = await apiClient.get("/categories?limit=100");
      return response.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availabilityStatus: "IN_STOCK",
      isFeatured: false,
      isVisible: true,
      priceCost: 0,
      priceSale: 0,
      ...defaultValues,
    },
  });

  const categoryOptions = (categoriesData ?? []).map(
    (c: { id: string; name: string }) => ({
      value: c.id,
      label: c.name,
    })
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={t("products.name")}
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Textarea
          label={t("products.description")}
          {...register("description")}
        />

        <Select
          label={t("products.category")}
          data={categoryOptions}
          value={watch("categoryId")}
          onChange={(v) => v && setValue("categoryId", v)}
          error={errors.categoryId?.message}
          searchable
          required
        />

        <NumberInput
          label={t("products.priceCost")}
          value={watch("priceCost")}
          onChange={(val) => setValue("priceCost", Number(val ?? 0))}
          min={0}
          prefix="$"
        />

        <NumberInput
          label={t("products.priceSale")}
          value={watch("priceSale")}
          onChange={(val) => setValue("priceSale", Number(val ?? 0))}
          min={0.01}
          prefix="$"
          required
        />

        <Select
          label={t("products.availability")}
          value={watch("availabilityStatus")}
          onChange={(v) =>
            v && setValue("availabilityStatus", v as "IN_STOCK" | "CHECK_SUPPLIER")
          }
          data={[
            { value: "IN_STOCK", label: t("availability.IN_STOCK") },
            { value: "CHECK_SUPPLIER", label: t("availability.CHECK_SUPPLIER") },
          ]}
        />

        <Textarea
          label={t("products.supplierInfo")}
          {...register("supplierInfo")}
        />

        <Switch
          label={t("products.visible")}
          checked={watch("isVisible")}
          onChange={(e) => setValue("isVisible", e.currentTarget.checked)}
        />

        <Switch
          label={t("products.featured")}
          checked={watch("isFeatured")}
          onChange={(e) => setValue("isFeatured", e.currentTarget.checked)}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {t("common.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
