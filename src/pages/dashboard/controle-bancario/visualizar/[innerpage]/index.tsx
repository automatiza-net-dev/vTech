import SingleBanking from "@/OLD/components/Banking/Single";
import { LayoutDashboard } from "@/presentation";
import { PrivatePageAdmin } from "infinity-forge";

export default function SingleBankingPage() {
  return (
    <PrivatePageAdmin>
      <LayoutDashboard>
        <SingleBanking />
      </LayoutDashboard>
    </PrivatePageAdmin>
  );
}
