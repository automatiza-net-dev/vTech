import { DashboardAdmin, LayoutAdmin } from "@/presentation";

export default function DashboardFranchisorPage() {
  return (
    <LayoutAdmin disableBreadcrumb>
      <DashboardAdmin />
    </LayoutAdmin>
  );
}
