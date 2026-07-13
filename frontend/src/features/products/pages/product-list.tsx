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
import { useProducts, useDeleteProduct } from "../hooks/use-products";
import { EmptyState } from "../../../components/common/empty-state";
import { ConfirmDialog } from "../../../components/common/confirm-dialog";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";
import { SearchInput } from "../../../components/common/search-input";
import { AvailabilityBadge } from "../../../components/common/availability-badge";
import { useDebounce } from "../../../hooks/use-debounce";

export function ProductListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, error, refetch } = useProducts({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteProduct();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;

  const products = data?.data ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>{t("products.title")}</Title>
        <Button leftSection={<Plus size={16} />} onClick={() => navigate("/products/create")}>
          {t("products.create")}
        </Button>
      </Group>

      <SearchInput value={search} onChange={setSearch} />

      {products.length === 0 ? (
        <EmptyState
          title={t("products.noProducts")}
          description={t("products.noProductsDescription")}
        />
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "25%" }}>{t("products.name")}</Table.Th>
              <Table.Th style={{ width: "15%" }}>{t("products.category")}</Table.Th>
              <Table.Th style={{ width: "12%" }}>{t("products.priceSale")}</Table.Th>
              <Table.Th style={{ width: "16%" }}>{t("products.availability")}</Table.Th>
              <Table.Th style={{ width: "10%" }}>{t("products.visible")}</Table.Th>
              <Table.Th style={{ width: "10%" }}>{t("products.featured")}</Table.Th>
              <Table.Th style={{ width: "12%", textAlign: "right" }}>{t("common.actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td style={{ fontWeight: 500 }}>{product.name}</Table.Td>
                <Table.Td>{product.category?.name ?? "-"}</Table.Td>
                <Table.Td>${product.priceSale.toLocaleString()}</Table.Td>
                <Table.Td>
                  <AvailabilityBadge status={product.availabilityStatus} />
                </Table.Td>
                <Table.Td>
                  <Badge color={product.isVisible ? "green" : "gray"}>
                    {product.isVisible ? t("common.yes") : t("common.no")}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={product.isFeatured ? "blue" : "gray"}>
                    {product.isFeatured ? t("common.yes") : t("common.no")}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon variant="subtle" onClick={() => navigate(`/products/${product.id}/edit`)}>
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => setDeleteId(product.id)}>
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
            deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
}
