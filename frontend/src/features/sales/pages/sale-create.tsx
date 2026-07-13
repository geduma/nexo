import { useNavigate } from "react-router-dom";
import { Stack, Title, TextInput, Textarea, NumberInput, Select, Button, Group } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../../../services/api/client";
import { saleSchema, type SaleForm } from "../validations/sale.schema";

export function SaleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products-select"],
    queryFn: async () => {
      const response = await apiClient.get("/products?limit=100&visible=true");
      return response.data.data;
    },
  });

  const { handleSubmit, control, formState: { errors } } = useForm<SaleForm>({
    resolver: zodResolver(saleSchema),
    defaultValues: { quantity: 1, salePrice: 0 },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SaleForm) => apiClient.post("/sales", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      notifications.show({ message: t("common.success"), color: "green" });
      navigate("/sales");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      notifications.show({
        message: error.response?.data?.message ?? t("common.error"),
        color: "red",
      });
    },
  });

  const productOptions = (products ?? []).map((p: { id: string; name: string }) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <Stack gap="lg" maw={500}>
      <Title order={2}>{t("sales.register")}</Title>

      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
        <Stack gap="md">
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <Select
                label={t("sales.product")}
                data={productOptions}
                {...field}
                value={field.value ?? null}
                error={errors.productId?.message}
                searchable
                required
              />
            )}
          />

          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("sales.customerName")}
                {...field}
                value={field.value ?? ""}
                error={errors.customerName?.message}
                required
              />
            )}
          />

          <Controller
            name="customerContact"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("sales.customerContact")}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label={t("sales.quantity")}
                value={field.value}
                onChange={(val) => field.onChange(Number(val ?? 1))}
                error={errors.quantity?.message}
                min={1}
                required
              />
            )}
          />

          <Controller
            name="salePrice"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label={t("sales.salePrice")}
                value={field.value}
                onChange={(val) => field.onChange(Number(val ?? 0))}
                error={errors.salePrice?.message}
                min={0.01}
                prefix="$"
                required
              />
            )}
          />

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select
                label={t("sales.paymentMethod")}
                {...field}
                value={field.value ?? null}
                data={[
                  { value: "Cash", label: t("sales.paymentMethods.Cash") },
                  { value: "Transfer", label: t("sales.paymentMethods.Transfer") },
                  { value: "Nequi", label: t("sales.paymentMethods.Nequi") },
                  { value: "Daviplata", label: t("sales.paymentMethods.Daviplata") },
                  { value: "Credit Card", label: t("sales.paymentMethods.Credit Card") },
                ]}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                label={t("sales.notes")}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => navigate("/sales")}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {t("common.save")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
