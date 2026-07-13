import { useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  Group,
  Button,
  Table,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { Plus, Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useCategories, useDeleteCategory } from "../hooks/use-categories";
import { EmptyState } from "../../../components/common/empty-state";
import { ConfirmDialog } from "../../../components/common/confirm-dialog";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";
import { SearchInput } from "../../../components/common/search-input";
import { useDebounce } from "../../../hooks/use-debounce";

export function CategoryListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, error, refetch } = useCategories({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteCategory();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;

  const categories = data?.data ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>{t("categories.title")}</Title>
        <Button leftSection={<Plus size={16} />} onClick={() => navigate("/categories/create")}>
          {t("categories.create")}
        </Button>
      </Group>

      <SearchInput value={search} onChange={setSearch} />

      {categories.length === 0 ? (
        <EmptyState
          title={t("categories.noCategories")}
          description={t("categories.noCategoriesDescription")}
        />
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "40%" }}>{t("categories.name")}</Table.Th>
              <Table.Th style={{ width: "20%" }}>{t("categories.displayOrder")}</Table.Th>
              <Table.Th style={{ width: "20%" }}>{t("categories.active")}</Table.Th>
              <Table.Th style={{ width: "20%", textAlign: "right" }}>{t("common.actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((category) => (
              <Table.Tr key={category.id}>
                <Table.Td style={{ fontWeight: 500 }}>{category.name}</Table.Td>
                <Table.Td>{category.displayOrder}</Table.Td>
                <Table.Td>
                  <Badge color={category.isActive ? "green" : "gray"}>
                    {category.isActive ? t("common.yes") : t("common.no")}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon variant="subtle" onClick={() => navigate(`/categories/${category.id}/edit`)}>
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => setDeleteId(category.id)}>
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <ConfirmDialog
        opened={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title={t("common.confirmDelete")}
        message={t("common.confirmDelete")}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
}
