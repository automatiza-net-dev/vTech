import SingleColaborator from "@/OLD/components/Colaborators/Collaborators/Single";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SingleColaboratorPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <SingleColaborator />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
