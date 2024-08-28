import MedicalPrescription from "@/OLD/components/Hospitalization/MedicalPrescription";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";

export default function MedicalPrescriptionDuplicatePage() {
  return (
    <LayoutDashboard>
      <MedicalPrescription duplicate={true} />
    </LayoutDashboard>
  );
}
