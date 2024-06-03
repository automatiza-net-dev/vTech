import HospitalizationConsult from "@/OLD/components/HospitalizationConsult";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function HospitalizationConsultPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <HospitalizationConsult />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
