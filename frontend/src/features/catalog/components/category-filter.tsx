import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();

  const data = [
    { value: "__all__", label: t("catalog.allProducts") },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <Select
      data={data}
      value={selected ?? "__all__"}
      onChange={(val) => onSelect(val === "__all__" ? null : val)}
      w={220}
      allowDeselect={false}
    />
  );
}
