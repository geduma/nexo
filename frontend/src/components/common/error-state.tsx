import { Stack, Text, Paper, Button } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Paper p="xl" ta="center" radius="md" withBorder>
      <Stack align="center" gap="md">
        <AlertTriangle size={48} color="var(--mantine-color-red-6)" />
        <div>
          <Text fw={500} size="lg">
            {t("errors.serverError")}
          </Text>
          <Text c="dimmed" size="sm">
            {message ?? t("errors.networkError")}
          </Text>
        </div>
        {onRetry && (
          <Button variant="light" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
