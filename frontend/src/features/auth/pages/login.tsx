import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Stack, TextInput, PasswordInput, Button, Title, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../stores/auth.store";
import { apiClient } from "../../../services/api/client";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      login(response.data.data.token);
      navigate("/dashboard");
    } catch {
      setError(t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="xl" maw={400} mx="auto" mt="10vh" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={2} ta="center">
            {t("app.name")}
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            {t("auth.login")}
          </Text>

          {error && (
            <Text c="red" size="sm" ta="center">
              {error}
            </Text>
          )}

          <TextInput
            label={t("auth.email")}
            placeholder="admin@nexo.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          <PasswordInput
            label={t("auth.password")}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            {t("auth.loginButton")}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
