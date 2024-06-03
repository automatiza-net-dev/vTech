import BorderoDetails from "@/OLD/components/Titles/DetailsBordero";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function BorderoDetailsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <BorderoDetails />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
