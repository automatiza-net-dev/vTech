import { TriggerModal } from "@/presentation";
import { AuthorizationSell } from "../authorization-sell";


export const cancelledStatus = {
  P: "Cancelamento pendente",
  A: "Cancelamento avaliado",
  N: "Cancelamento não autorizado",
  S: "Cancelamento autorizaado",
};


export const billStatusFormatter = (bill, setReload) => {
  const { status, pending } = bill;
  const pedingStatus = (status === "ABERTA" && pending)
  if (pedingStatus || (bill.cancelled === "P" || bill.cancelled === "A")) {
    return (
      <TriggerModal
        title={"Autorização de vendas"}
        triggerContent={pedingStatus ? "Pendente" : "Pendente cancelamento"}
        content={<AuthorizationSell cancelled={!pedingStatus} billId={bill?.id} setReload={setReload} />}
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

  
  return bill.cancelled
    ? cancelledStatus[bill.cancelled]
    : statusStyles[status] || status;
};
