import CheckScreen from "@/OLD/components/DailyCashier/CheckScreen";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CheckScreenPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <CheckScreen />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
