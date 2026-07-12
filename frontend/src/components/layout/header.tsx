import { Group, ActionIcon, Text, Select } from "@mantine/core";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../stores/settings.store";

export function Header() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  const toggleTheme = () => {
    const next = computedScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
  };

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setLanguage(value);
      i18n.changeLanguage(value);
    }
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Text fw={700} size="lg">
        {t("app.name")}
      </Text>

      <Group>
        <Select
          size="xs"
          value={language}
          onChange={handleLanguageChange}
          data={[
            { value: "es", label: "ES" },
            { value: "en", label: "EN" },
          ]}
          w={70}
          aria-label="Select language"
        />
        <ActionIcon variant="subtle" onClick={toggleTheme} aria-label={computedScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          {computedScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
