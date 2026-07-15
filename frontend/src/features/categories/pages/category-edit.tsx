import { useNavigate, useParams } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { CategoryFormComponent } from "../components/category-form";
import { useCategory, useUpdateCategory } from "../hooks/use-categories";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";

export function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: category, isLoading, error, refetch } = useCategory(id!);
  const updateMutation = useUpdateCategory();

  if (isLoading) return <LoadingSkeleton />;
  if (error || !category?.data) return <ErrorState onRetry={refetch} />;

  const cat = category.data;

  return (
    <Stack gap="lg" maw={500}>
      <Title order={2}>{t("categories.edit")}</Title>
      <CategoryFormComponent
        defaultValues={{
          name: cat.name,
          description: cat.description ?? undefined,
          isActive: cat.isActive,
        }}
        onSubmit={(data) =>
          updateMutation.mutate(
            { id: id!, data },
            { onSuccess: () => navigate("/categories") }
          )
        }
        loading={updateMutation.isPending}
      />
    </Stack>
  );
}
