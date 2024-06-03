import NoteDetails from "@/OLD/components/Notes/Single";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function NoteDetailsPage() {
  <PrivatePageAdmin>
    <LayoutDashboard>
      <NoteDetails />
    </LayoutDashboard>
  </PrivatePageAdmin>;
}
