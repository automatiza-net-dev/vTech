import { TriggerModal } from "@/presentation";
import { AuthorizationBudget } from "../authorization-budget";

export const budgetStatusFormatter = (budget) => {
  if (budget?.status === "ABERTO" && budget?.pending) {
    return (
      <TriggerModal
        title="Autorização de Orçamento"
        triggerContent="Pendente"
        content={<AuthorizationBudget budgetId={budget?.id} setReload />}
        width={1400}
        footer={null}
      />
    );
  }

  const statusStyles = {
    ABERTO: <span style={{ color: "red" }}>Aberta</span>,
    EXTORNADA: "Extornada",
    CONFIRMADO: "Confirmado",
    NAO_CONFIRMADO__CANCELADO: "Não confirmado",
    CONFIRMADO_PARCIAL: "Confirmado parcial",
    BAIXADA: <span style={{ color: "green" }}>Baixada</span>,
  };

  return statusStyles[budget?.status] || budget?.status;
};
