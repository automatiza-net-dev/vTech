import Banking from "@/OLD/components/Banking";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function BankingPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <Banking />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
