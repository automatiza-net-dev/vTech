import CreateSupplier from "@/OLD/components/Suppliers/Actions/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CreateSupplierPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <CreateSupplier />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
