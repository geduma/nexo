import { Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface AvailabilityBadgeProps {
  status: "IN_STOCK" | "CHECK_SUPPLIER";
}

export function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const { t } = useTranslation();

  const color = status === "IN_STOCK" ? "green" : "yellow";

  return (
    <Badge color={color} variant="light">
      {t(`availability.${status}`)}
    </Badge>
  );
}
