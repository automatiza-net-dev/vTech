import Suppliers from "@/OLD/components/Suppliers";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SuppliersPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Suppliers />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
