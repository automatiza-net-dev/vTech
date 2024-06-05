import { UtiBeds } from "@/OLD/components/UtiBeds";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function UtiBedsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <UtiBeds />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
