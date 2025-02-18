import { TriggerModal } from "@/presentation";
import { AuthorizationSell } from "../authorization-sell";

export const cancelledStatus = {
  P: "Cancelamento pendente",
  A: "Cancelamento avaliado",
  N: "Cancelamento não autorizado",
  S: "Cancelamento autorizaado",
};

export const billStatusFormatter = (bill, setReload, visible, setVisible) => {
  const { status, pending } = bill;
  const pedingStatus = status === "ABERTA" && pending;
  if (pedingStatus || bill?.cancelled === "P" || bill?.cancelled === "A") {
    return (
      <TriggerModal
        visible={visible}
        setVisible={setVisible}
        title={
          bill?.cancelled ? "Cancelamento de venda" : "Autorização de vendas"
        }
        triggerContent={pedingStatus ? "Pendente" : "Pendente cancelamento"}
        content={
          <AuthorizationSell
            onSuccess={() => {
              setVisible(false);
            
            
            }}
            cancelled={!pedingStatus}
            {...bill}
          />
        }
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
