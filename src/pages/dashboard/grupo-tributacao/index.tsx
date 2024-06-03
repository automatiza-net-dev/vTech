import PlansGroup from "@/OLD/components/PlansGroup";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function PlansGroupPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <PlansGroup />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
