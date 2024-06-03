import ActionsProductsGroup from "@/OLD/components/ProductsGroup/Actions";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function ActionsProductsGroupPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <ActionsProductsGroup />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
