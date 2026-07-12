import { Paper, Stack, Text, Button } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ErrorPage() {
  const { t } = useTranslation();

  return (
    <Paper p="xl" maw={400} mx="auto" mt="15vh" radius="md" withBorder>
      <Stack align="center" gap="md">
        <AlertTriangle size={48} color="var(--mantine-color-orange-6)" />
        <Text fw={500} size="lg">{t("errors.serverError")}</Text>
        <Text c="dimmed" size="sm" ta="center">
          Ha ocurrido un error inesperado. Por favor intenta de nuevo.
        </Text>
        <Button variant="light" onClick={() => window.location.reload()}>
          {t("common.retry")}
        </Button>
      </Stack>
    </Paper>
  );
}
