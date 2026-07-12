import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  w?: number | string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  w = 300,
}: SearchInputProps) {
  const { t } = useTranslation();

  return (
    <TextInput
      placeholder={placeholder ?? t("common.search")}
      leftSection={<Search size={16} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      w={w}
      aria-label={t("common.search")}
    />
  );
}
