import { LayoutDashboard } from "@/presentation";
import { VaccinesList } from "@/OLD/components/Vaccines";

export default function VaccinesPage() {
  return (
    <LayoutDashboard>
      <VaccinesList />
    </LayoutDashboard>
  );
}
