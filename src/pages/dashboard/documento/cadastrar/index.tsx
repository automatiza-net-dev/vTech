import DocumentsCreate from "@/OLD/components/Document/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DocumentsCreatePage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DocumentsCreate />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
