import PaymentMethods from "@/OLD/components/PaymentMethods";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function PaymentMethodsPage() {
  return (
    <LayoutDashboard>
      <PaymentMethods />
    </LayoutDashboard>
  );
}
