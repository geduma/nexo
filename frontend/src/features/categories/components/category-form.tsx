import {
  Stack,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";
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
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => {
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
              label={t("categories.name")}
              {...field}
              value={field.value ?? ""}
              error={errors.name?.message}
              required
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              label={t("categories.description")}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { ref, value: _value, ...field } }) => (
            <Switch
              {...field}
              ref={ref}
              label={_value ? t("categories.active") : t("common.no")}
              checked={_value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
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
