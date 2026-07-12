import { useNavigate } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { CategoryFormComponent } from "../components/category-form";
import { useCreateCategory } from "../hooks/use-categories";

export function CategoryCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateCategory();

  return (
    <Stack gap="lg" maw={500}>
      <Title order={2}>{t("categories.create")}</Title>
      <CategoryFormComponent
        onSubmit={(data) =>
          createMutation.mutate(data, { onSuccess: () => navigate("/categories") })
        }
        loading={createMutation.isPending}
      />
    </Stack>
  );
}
