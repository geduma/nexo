import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { categorySchema, type CategoryForm } from "../validations/category.schema";

interface CategoryFormComponentProps {
  defaultValues?: Partial<CategoryForm>;
  onSubmit: (data: CategoryForm) => void;
  loading?: boolean;
}

export function CategoryFormComponent({
  defaultValues,
  onSubmit,
  loading = false,
}: CategoryFormComponentProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      displayOrder: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={t("categories.name")}
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Textarea
          label={t("categories.description")}
          {...register("description")}
        />

        <NumberInput
          label={t("categories.displayOrder")}
          value={watch("displayOrder")}
          onChange={(val) => setValue("displayOrder", Number(val ?? 0))}
          min={0}
        />

        <Switch
          label={t("categories.active")}
          checked={watch("isActive")}
          onChange={(e) => setValue("isActive", e.currentTarget.checked)}
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
