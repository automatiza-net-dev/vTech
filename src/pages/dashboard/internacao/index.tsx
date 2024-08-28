import HospitalizationTable from "@/OLD/components/Hospitalization";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function HospitalizationTablePage() {
  return (
    <LayoutDashboard>
      <HospitalizationTable />
    </LayoutDashboard>
  );
}
