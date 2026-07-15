import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Stack, Text, Button } from "@mantine/core";
import { ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Paper p="xl" maw={400} mx="auto" mt="15vh" radius="md" withBorder role="alert" aria-label="Unauthorized access">
      <Stack align="center" gap="md">
        <ShieldOff size={48} color="var(--mantine-color-red-6)" aria-hidden="true" />
        <Text fw={500} size="lg">{t("errors.unauthorized")}</Text>
        <Text c="dimmed" size="sm" ta="center">
          {t("errors.redirectingToLogin")}
        </Text>
        <Button variant="light" onClick={() => navigate("/login")}>
          {t("auth.login")}
        </Button>
      </Stack>
    </Paper>
  );
}
