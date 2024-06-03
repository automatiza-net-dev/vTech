import { LayoutDashboard } from "@/presentation";
import { ScheduleType } from "@/OLD/components/ScheduleType";
import { PrivatePageAdmin } from "infinity-forge";

export default function ScheduleCategoriesPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <ScheduleType />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
