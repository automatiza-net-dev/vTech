import { PrivatePageAdmin } from "infinity-forge";
import { Goals, LayoutDashboard } from "@/presentation";

export default function LancamentoMetas() {
    return  <PrivatePageAdmin>
    <LayoutDashboard>
      <Goals />
    </LayoutDashboard>
  </PrivatePageAdmin>
}