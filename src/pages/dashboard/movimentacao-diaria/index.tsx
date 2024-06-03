import DailyMovements from "@/OLD/components/DailyMovements";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DailyMovementsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DailyMovements />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
