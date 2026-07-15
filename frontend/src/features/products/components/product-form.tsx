import { useState, useEffect } from "react";
import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Select,
  Button,
  Group,
  Collapse,
} from "@mantine/core";
import { ChevronDown, ChevronRight } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import { productSchema, type ProductForm } from "../validations/product.schema";
import { ImageUpload, type ImageFile } from "../../../components/common/image-upload";

interface ProductFormComponentProps {
  defaultValues?: Partial<ProductForm>;
  onSubmit: (data: ProductForm, imageFiles?: ImageFile[]) => void;
  loading?: boolean;
  existingImages?: ImageFile[];
}

export function ProductFormComponent({
  defaultValues,
  onSubmit,
  loading = false,
  existingImages,
}: ProductFormComponentProps) {
  const { t } = useTranslation();
  const [imageFiles, setImageFiles] = useState<ImageFile[]>(existingImages ?? []);
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setImageFiles(existingImages);
    }
  }, [existingImages]);
  const [extraOpen, setExtraOpen] = useState(
    !!(defaultValues?.description || defaultValues?.supplierInfo)
  );

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => {
      const response = await apiClient.get("/categories?limit=100&sortBy=name&sortOrder=ASC");
      return response.data.data;
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availabilityStatus: "IN_STOCK",
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
    <form onSubmit={handleSubmit((data) => onSubmit(data, imageFiles), (err) => {
      notifications.show({
        title: t("common.error"),
        message: Object.values(err).map(e => e?.message).filter(Boolean).join(", "),
        color: "red",
      });
    })}>
      <Stack gap="md">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("products.name")}
              {...field}
              value={field.value ?? ""}
              error={errors.name?.message}
              required
            />
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              label={t("products.category")}
              data={categoryOptions}
              {...field}
              value={field.value ?? null}
              error={errors.categoryId?.message}
              searchable
              required
            />
          )}
        />

        <Controller
          name="priceCost"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={t("products.priceCost")}
              value={field.value}
              onChange={(val) => field.onChange(Number(val ?? 0))}
              error={errors.priceCost?.message}
              min={0}
              prefix="$"
            />
          )}
        />

        <Controller
          name="priceSale"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={t("products.priceSale")}
              value={field.value}
              onChange={(val) => field.onChange(Number(val ?? 0))}
              error={errors.priceSale?.message}
              min={0.01}
              prefix="$"
              required
            />
          )}
        />

        <Controller
          name="availabilityStatus"
          control={control}
          render={({ field }) => (
            <Select
              label={t("products.availability")}
              {...field}
              value={field.value ?? null}
              error={errors.availabilityStatus?.message}
              data={[
                { value: "IN_STOCK", label: t("availability.IN_STOCK") },
                { value: "CHECK_SUPPLIER", label: t("availability.CHECK_SUPPLIER") },
              ]}
            />
          )}
        />

        <Controller
          name="isVisible"
          control={control}
          render={({ field: { ref, value: _value, ...field } }) => (
            <Switch
              {...field}
              ref={ref}
              label={t("products.visible")}
              checked={_value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
        />

        <Button
          variant="subtle"
          size="sm"
          onClick={() => setExtraOpen((o) => !o)}
          leftSection={extraOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        >
          {t("products.moreFields")}
        </Button>

        <Collapse in={extraOpen}>
          <Stack gap="md">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label={t("products.description")}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name="supplierInfo"
              control={control}
              render={({ field }) => (
                <Textarea
                  label={t("products.supplierInfo")}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </Stack>
        </Collapse>

        <ImageUpload images={imageFiles} onChange={setImageFiles} />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {t("common.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
