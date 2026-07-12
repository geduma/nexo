import { Stack, Title, Text, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Stack align="center" justify="center" mih="80vh" gap="md" role="alert" aria-label="Page not found">
      <Title order={1} c="dimmed">404</Title>
      <Text size="lg">{t("errors.notFound")}</Text>
      <Button component={Link} to="/" variant="light">
        {t("catalog.backToCatalog")}
      </Button>
    </Stack>
  );
}
