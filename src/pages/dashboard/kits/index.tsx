import Kits from "@/OLD/components/ProductsGroup";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function KitsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Kits />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
