import DocumentsEdit from "@/OLD/components/Document/Edit";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DocumentsEditPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DocumentsEdit />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
