import { useNavigate } from "react-router-dom";
import { Stack, Title, TextInput, Textarea, NumberInput, Select, Button, Group } from "@mantine/core";
import { useForm } from "react-hook-form";
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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SaleForm>({
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
          <Select
            label={t("sales.product")}
            data={productOptions}
            value={watch("productId")}
            onChange={(v) => v && setValue("productId", v)}
            error={errors.productId?.message}
            searchable
            required
          />

          <TextInput
            label={t("sales.customerName")}
            {...register("customerName")}
            error={errors.customerName?.message}
            required
          />

          <TextInput
            label={t("sales.customerContact")}
            {...register("customerContact")}
          />

          <NumberInput
            label={t("sales.quantity")}
            value={watch("quantity")}
            onChange={(val) => setValue("quantity", Number(val ?? 1))}
            min={1}
            required
          />

          <NumberInput
            label={t("sales.salePrice")}
            value={watch("salePrice")}
            onChange={(val) => setValue("salePrice", Number(val ?? 0))}
            min={0.01}
            prefix="$"
            required
          />

          <Select
            label={t("sales.paymentMethod")}
            value={watch("paymentMethod")}
            onChange={(v) => v && setValue("paymentMethod", v)}
            data={[
              { value: "Cash", label: "Efectivo" },
              { value: "Transfer", label: "Transferencia" },
              { value: "Nequi", label: "Nequi" },
              { value: "Daviplata", label: "Daviplata" },
              { value: "Credit Card", label: "Tarjeta de Credito" },
            ]}
          />

          <Textarea
            label={t("sales.notes")}
            {...register("notes")}
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
