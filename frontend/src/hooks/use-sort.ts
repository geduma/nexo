import { useState, useCallback } from "react";

type SortOrder = "ASC" | "DESC";

interface UseSortOptions {
  initialSortBy?: string;
  initialSortOrder?: SortOrder;
}

interface UseSortReturn {
  sortBy: string;
  sortOrder: SortOrder;
  setSortBy: (field: string) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
}

export function useSort({
  initialSortBy = "createdAt",
  initialSortOrder = "DESC",
}: UseSortOptions = {}): UseSortReturn {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
  }, []);

  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
  };
}
