interface CurrencyDisplayProps {
  amount: number;
  currencySymbol?: string;
}

export function CurrencyDisplay({
  amount,
  currencySymbol = "$",
}: CurrencyDisplayProps) {
  return (
    <span>
      {currencySymbol} {amount.toLocaleString()}
    </span>
  );
}
