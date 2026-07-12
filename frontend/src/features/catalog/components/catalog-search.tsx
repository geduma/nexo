import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CatalogSearch({ value, onChange }: CatalogSearchProps) {
  const { t } = useTranslation();

  return (
    <TextInput
      placeholder={t("catalog.search")}
      leftSection={<Search size={16} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      maw={400}
      mx="auto"
      aria-label={t("catalog.search")}
    />
  );
}
