import DocumentsList from "@/OLD/components/Document/List";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function DocumentsListPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <DocumentsList />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
