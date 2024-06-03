import { LayoutDashboard } from "@/presentation";
import { Single } from "@/OLD/components/ScheduleType/Single";
import { PrivatePageAdmin } from "infinity-forge";

export default function ScheduleCategoriesSinglePage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Single />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
