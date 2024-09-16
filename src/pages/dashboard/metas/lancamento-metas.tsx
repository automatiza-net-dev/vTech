import { PageWrapper } from "infinity-forge";
import { Goals, LayoutDashboard } from "@/presentation";

export default function LancamentoMetas() {
  return (
    <LayoutDashboard>
      <PageWrapper title="Lançamento de metas">
        <Goals />
      </PageWrapper>
    </LayoutDashboard>
  );
}
