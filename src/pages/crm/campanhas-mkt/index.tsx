import { CampanhasMkt, LayoutDashboard, PermissionItem } from "@/presentation";
import { PageWrapper } from "infinity-forge";

export default function CrmkCamapanhasMktPage() {
  return (
    <PermissionItem hash="MKT00">
      <LayoutDashboard>
        <PageWrapper title="Campanhas de Marketing">
          <CampanhasMkt />
        </PageWrapper>
      </LayoutDashboard>
    </PermissionItem>
  );
}
