import MoneyView from "@/components/MoneyView";
import { TRUMA_THEME } from "@/lib/kids";

export default function TrumaMoneyPage() {
  return (
    <MoneyView
      kidId="truma"
      name="Truma"
      color={TRUMA_THEME.teal}
      accent={TRUMA_THEME.rose}
      uiSize="normal"
    />
  );
}
