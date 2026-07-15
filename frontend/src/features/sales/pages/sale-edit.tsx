import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  Title,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSale, useUpdateSale } from "../hooks/use-sales";
import { LoadingSkeleton } from "../../../components/common/loading-skeleton";
import { ErrorState } from "../../../components/common/error-state";

export function SaleEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: sale, isLoading, error, refetch } = useSale(id!);
  const updateMutation = useUpdateSale();

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  if (isLoading) return <LoadingSkeleton />;
  if (error || !sale?.data) return <ErrorState onRetry={refetch} />;

  const s = sale.data;

  const handleSubmit = () => {
    updateMutation.mutate(
      {
        id: id!,
        data: {
          customerName: customerName !== "" ? customerName : s.customerName,
          customerContact: customerContact !== "" ? customerContact : (s.customerContact ?? undefined),
          quantity: quantity ?? s.quantity,
          salePrice: salePrice ?? s.salePrice,
          paymentMethod: paymentMethod ?? (s.paymentMethod ?? undefined),
          notes: notes !== "" ? notes : (s.notes ?? undefined),
        },
      },
      { onSuccess: () => navigate("/sales") }
    );
  };

  return (
    <Stack gap="lg" maw={500}>
      <Title order={2}>{t("sales.edit")}</Title>

      <TextInput
        label={t("sales.customerName")}
        value={customerName !== "" ? customerName : s.customerName}
        onChange={(e) => setCustomerName(e.currentTarget.value)}
        required
      />

      <TextInput
        label={t("sales.customerContact")}
        value={customerContact !== "" ? customerContact : (s.customerContact ?? "")}
        onChange={(e) => setCustomerContact(e.currentTarget.value)}
      />

      <NumberInput
        label={t("sales.quantity")}
        value={quantity !== null ? quantity : s.quantity}
        onChange={(v) => setQuantity(typeof v === "number" ? v : null)}
        min={1}
        required
      />

      <NumberInput
        label={t("sales.salePrice")}
        value={salePrice !== null ? salePrice : s.salePrice}
        onChange={(v) => setSalePrice(typeof v === "number" ? v : null)}
        min={0}
        decimalScale={2}
        required
      />

      <Select
        label={t("sales.paymentMethod")}
        value={paymentMethod ?? (s.paymentMethod ?? null)}
        onChange={setPaymentMethod}
        data={[
          { value: "Cash", label: t("sales.paymentMethods.Cash") },
          { value: "Transfer", label: t("sales.paymentMethods.Transfer") },
          { value: "Nequi", label: t("sales.paymentMethods.Nequi") },
          { value: "Daviplata", label: t("sales.paymentMethods.Daviplata") },
          { value: "Credit Card", label: t("sales.paymentMethods.Credit Card") },
        ]}
      />

      <TextInput
        label={t("sales.notes")}
        value={notes !== "" ? notes : (s.notes ?? "")}
        onChange={(e) => setNotes(e.currentTarget.value)}
      />

      <Group justify="flex-end">
        <Button variant="subtle" onClick={() => navigate("/sales")}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSubmit} loading={updateMutation.isPending}>
          {t("common.save")}
        </Button>
      </Group>
    </Stack>
  );
}
