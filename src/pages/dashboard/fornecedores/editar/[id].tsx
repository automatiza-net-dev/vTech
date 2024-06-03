import { EditSupplier } from "@/OLD/components/Suppliers/Actions/Edit";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function EditSupplierPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <EditSupplier />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
