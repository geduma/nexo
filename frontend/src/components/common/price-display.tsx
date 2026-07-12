import { Text } from "@mantine/core";

interface PriceDisplayProps {
  price: number;
  currencySymbol?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fw?: number;
}

export function PriceDisplay({
  price,
  currencySymbol = "$",
  size = "sm",
  fw = 600,
}: PriceDisplayProps) {
  return (
    <Text size={size} fw={fw}>
      {currencySymbol} {price.toLocaleString()}
    </Text>
  );
}
