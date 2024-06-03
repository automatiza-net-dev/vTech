import HospitalizationTable from "@/OLD/components/Hospitalization";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function HospitalizationTablePage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <HospitalizationTable />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
