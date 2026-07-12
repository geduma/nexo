import {
  Table,
  Group,
  Text,
  Pagination,
} from "@mantine/core";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  onSort?: (key: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyText?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  emptyText,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  const getSortIcon = (key: string) => {
    if (sortBy !== key) return <ChevronsUpDown size={14} />;
    return sortOrder === "ASC" ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

  return (
    <div>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th
                key={col.key}
                style={{ cursor: col.sortable ? "pointer" : "default" }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <Group gap={4}>
                  {col.header}
                  {col.sortable && getSortIcon(col.key)}
                </Group>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text ta="center" c="dimmed" py="xl">
                  {emptyText ?? t("common.noData")}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            data.map((row, index) => (
              <Table.Tr
                key={index}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <Table.Td key={col.key}>
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as React.ReactNode)}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {totalPages !== undefined && totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={page ?? 1}
            total={totalPages}
            onChange={onPageChange ?? (() => {})}
          />
        </Group>
      )}
    </div>
  );
}
