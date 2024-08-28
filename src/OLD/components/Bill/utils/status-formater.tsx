import { TriggerModal } from "@/presentation";
import { AuthorizationSell } from "../authorization-sell";

export const billStatusFormatter = (bill, setReload) => {
  const { status, pending } = bill;

  if (status === "ABERTA" && pending) {
    return (
      <TriggerModal
        title="Autorização de vendas"
        triggerContent="Pendente"
        content={<AuthorizationSell billId={bill?.id} setReload={setReload} />}
        width={1400}
        footer={null}
      />
    );
  }

  const statusStyles = {
    ABERTA: <span style={{ color: "red" }}>Aberta</span>,
    EXTORNADA: "Extornada",
    BAIXADA: <span style={{ color: "green" }}>Baixada</span>,
  };

  return statusStyles[status] || status;
};
