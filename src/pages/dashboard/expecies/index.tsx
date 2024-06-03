import Species from "@/OLD/components/Species";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SpeciesPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Species />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
