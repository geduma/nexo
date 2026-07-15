import { Title, Box, Group, Select, Text } from "@mantine/core";
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
    <Box style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem 0" }}>
      <Box style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
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
      </Box>

      <Group gap="md" justify="center">
        {logoUrl && (
          <Box
            component="img"
            src={logoUrl}
            alt={businessName}
            h={48}
            style={{ objectFit: "contain" }}
          />
        )}
        <Box ta="center">
          <Title order={1} fw={700} style={{ letterSpacing: -0.5, lineHeight: 1.1 }}>
            {businessName}
          </Title>
          <Text size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 2 }}>
            {t("catalog.title")}
          </Text>
        </Box>
      </Group>
    </Box>
  );
}
