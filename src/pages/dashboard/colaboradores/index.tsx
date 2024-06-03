import { Collaborators } from "@/OLD/components/Colaborators";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function CollaboratorsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Collaborators />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
