import { Stack, Title, TextInput, Select, Button, Group } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useSettings, useUpdateSettings } from "../hooks/use-settings";
import { settingsSchema, type SettingsForm } from "../validations/settings.schema";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";

export function SettingsPage() {
  const { t } = useTranslation();
  const { data: settingsData, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: settingsData?.data ? {
      businessName: settingsData.data.businessName,
      currency: settingsData.data.currency,
      currencySymbol: settingsData.data.currencySymbol,
      defaultLanguage: settingsData.data.defaultLanguage as "es" | "en",
      whatsappNumber: settingsData.data.whatsappNumber,
      theme: settingsData.data.theme as "light" | "dark" | "system",
    } : undefined,
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <Stack gap="lg" maw={500}>
      <Title order={2}>{t("settings.title")}</Title>

      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} aria-label="Settings form">
        <Stack gap="md">
          <TextInput
            label={t("settings.businessName")}
            {...register("businessName")}
            error={errors.businessName?.message}
            required
          />

          <TextInput
            label={t("settings.currency")}
            {...register("currency")}
            error={errors.currency?.message}
            required
          />

          <TextInput
            label={t("settings.currencySymbol")}
            {...register("currencySymbol")}
            error={errors.currencySymbol?.message}
            required
          />

          <Select
            label={t("settings.language")}
            value={watch("defaultLanguage")}
            onChange={(v) => v && setValue("defaultLanguage", v as "es" | "en")}
            data={[
              { value: "es", label: "Español" },
              { value: "en", label: "English" },
            ]}
          />

          <Select
            label={t("settings.theme")}
            value={watch("theme")}
            onChange={(v) => v && setValue("theme", v as "light" | "dark" | "system")}
            data={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />

          <TextInput
            label={t("settings.whatsappNumber")}
            {...register("whatsappNumber")}
            error={errors.whatsappNumber?.message}
            placeholder="573001234567"
            required
          />

          <Group justify="flex-end">
            <Button type="submit" loading={updateMutation.isPending}>
              {t("common.save")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
