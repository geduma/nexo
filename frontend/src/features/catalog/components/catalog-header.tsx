import { Title, Box, Group, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../../stores/settings.store";

interface CatalogHeaderProps {
  businessName: string;
  logoUrl?: string | null;
}

export function CatalogHeader({ businessName, logoUrl }: CatalogHeaderProps) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setLanguage(value);
      i18n.changeLanguage(value);
    }
  };

  return (
    <Group justify="space-between" py="lg">
      <Group justify="center" style={{ flex: 1 }}>
        {logoUrl && (
          <Box
            component="img"
            src={logoUrl}
            alt={businessName}
            h={40}
            style={{ objectFit: "contain" }}
          />
        )}
        <Title order={1}>{businessName}</Title>
      </Group>
      <Select
        size="xs"
        value={language}
        onChange={handleLanguageChange}
        data={[
          { value: "es", label: "ES" },
          { value: "en", label: "EN" },
        ]}
        w={70}
        aria-label={t("common.language")}
      />
    </Group>
  );
}
