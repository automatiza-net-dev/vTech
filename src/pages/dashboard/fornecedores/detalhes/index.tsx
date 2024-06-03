import SingleSupplier from "@/OLD/components/Suppliers/Single";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SingleSupplierPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <SingleSupplier />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
