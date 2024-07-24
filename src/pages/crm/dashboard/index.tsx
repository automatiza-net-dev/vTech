import { ChartsSection, LayoutDashboard } from "@/presentation";
import { PageWrapper } from "infinity-forge";

export default function CrmDashboardPage() {
  return (
    <LayoutDashboard>
      <PageWrapper title="Dashboard CRM">
        <ChartsSection type="crm" />
      </PageWrapper>
    </LayoutDashboard>
  );
}
