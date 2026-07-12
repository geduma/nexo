import { useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  Group,
  Button,
  Table,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSales, useDeleteSale } from "../hooks/use-sales";
import { EmptyState } from "../../../components/common/empty-state";
import { ConfirmDialog } from "../../../components/common/confirm-dialog";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";
import { useDebounce } from "../../../hooks/use-debounce";

export function SaleListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, error, refetch } = useSales({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteSale();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;

  const sales = data?.data ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>{t("sales.title")}</Title>
        <Button leftSection={<Plus size={16} />} onClick={() => navigate("/sales/create")}>
          {t("sales.register")}
        </Button>
      </Group>

      <TextInput
        placeholder={t("common.search")}
        leftSection={<Search size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={300}
      />

      {sales.length === 0 ? (
        <EmptyState
          title={t("sales.noSales")}
          description={t("sales.noSalesDescription")}
        />
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("sales.saleDate")}</Table.Th>
              <Table.Th>{t("sales.product")}</Table.Th>
              <Table.Th>{t("sales.customerName")}</Table.Th>
              <Table.Th>{t("sales.quantity")}</Table.Th>
              <Table.Th>{t("sales.salePrice")}</Table.Th>
              <Table.Th>{t("sales.paymentMethod")}</Table.Th>
              <Table.Th>{t("common.actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sales.map((sale) => (
              <Table.Tr key={sale.id}>
                <Table.Td>{new Date(sale.saleDate).toLocaleDateString()}</Table.Td>
                <Table.Td>{sale.product?.name ?? "-"}</Table.Td>
                <Table.Td>{sale.customerName}</Table.Td>
                <Table.Td>{sale.quantity}</Table.Td>
                <Table.Td>${sale.salePrice.toLocaleString()}</Table.Td>
                <Table.Td>{sale.paymentMethod ?? "-"}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" onClick={() => navigate(`/sales/${sale.id}/edit`)}>
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => setDeleteId(sale.id)}>
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
