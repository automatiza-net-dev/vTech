import AddPayments from "@/OLD/components/Notes/AddPayments/AddPaymentsScreen";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function AddPaymentsPage() {
  <PrivatePageAdmin>
    <LayoutDashboard>
      <AddPayments />
    </LayoutDashboard>
  </PrivatePageAdmin>;
}
