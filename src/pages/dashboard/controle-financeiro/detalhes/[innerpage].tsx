import FinancialStatementDetails from "@/OLD/components/FinancialStatement/Details";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function FinancialStatementDetailsPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <FinancialStatementDetails />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
