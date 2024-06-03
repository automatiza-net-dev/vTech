import MedicalPrescription from "@/OLD/components/Hospitalization/MedicalPrescription";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function MedicalPrescriptionDuplicatePage() {
  return (
    <PrivatePageAdmin>
    <LayoutDashboard>
      <MedicalPrescription duplicate={true} />
    </LayoutDashboard>
    </PrivatePageAdmin>

  );
}
