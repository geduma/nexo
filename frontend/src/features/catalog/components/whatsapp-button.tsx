import { Button } from "@mantine/core";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WhatsAppButtonProps {
  productName: string;
  price: number;
  whatsappNumber: string;
  availabilityStatus?: "IN_STOCK" | "CHECK_SUPPLIER";
}

export function WhatsAppButton({
  productName,
  price,
  whatsappNumber,
  availabilityStatus = "IN_STOCK",
}: WhatsAppButtonProps) {
  const { t } = useTranslation();

  const getMessage = () => {
    let msg = `Hola, me interesa el producto: ${productName} - $${price.toLocaleString()}`;
    if (availabilityStatus === "CHECK_SUPPLIER") {
      msg += "\n\nConsultar disponibilidad";
    }
    return encodeURIComponent(msg);
  };

  return (
    <Button
      component="a"
      href={`https://wa.me/${whatsappNumber}?text=${getMessage()}`}
      target="_blank"
      color="green"
      leftSection={<MessageCircle size={16} />}
      fullWidth
      size="lg"
    >
      {availabilityStatus === "CHECK_SUPPLIER"
        ? t("availability.CHECK_SUPPLIER")
        : t("catalog.whatsappButton")}
    </Button>
  );
}
