import PaymentMethods from "@/OLD/components/PaymentMethods";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function PaymentMethodsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <PaymentMethods />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
