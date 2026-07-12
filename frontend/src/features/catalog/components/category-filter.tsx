import { Group, Button } from "@mantine/core";
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

  return (
    <Group justify="center" gap="xs">
      <Button
        variant={selected === null ? "filled" : "subtle"}
        size="xs"
        onClick={() => onSelect(null)}
      >
        {t("catalog.allProducts")}
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selected === cat.id ? "filled" : "subtle"}
          size="xs"
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </Group>
  );
}
