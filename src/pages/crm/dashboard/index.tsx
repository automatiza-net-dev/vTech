import {
  ChartsSection,
  LayoutDashboard,
  TablesSection,
} from "@/presentation";
import { PageWrapper } from "infinity-forge";

export default function CrmDashboardPage() {
  return (
    <LayoutDashboard>
      <PageWrapper title="Dashboard CRM">
        <ChartsSection  />

        <TablesSection  />
      </PageWrapper>
    </LayoutDashboard>
  );
}
