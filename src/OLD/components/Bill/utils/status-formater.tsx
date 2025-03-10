import { useState } from "react";

import { Modal } from "infinity-forge";

import { AuthorizationSell } from "../authorization-sell";

function Component({ pedingStatus, bill }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible(true)}
        style={{
          padding: 0,
          border: "none",
          background: "none",
          color: "#007bff",
        }}
      >
        {pedingStatus
          ? "Pendente"
          : bill?.cancelled === "P"
          ? "Pendente avaliação técnica"
          : bill?.cancelled === "A"
          ? "Finalizar cancelamento"
          : "Pendente avaliação financeira"}
      </button>

      <Modal
        open={visible}
        onClose={() => setVisible(false)}
        styles={{ maxWidth: 1400 }}
      >
        <AuthorizationSell
          {...bill}
          isCancelled={!pedingStatus}
          onSuccess={() => setVisible(false)}
        />
      </Modal>
    </>
  );
}

export const cancelledStatus = {
  P: "Cancelamento pendente",
  A: "Cancelamento avaliado",
  // N: "Cancelamento não autorizado",
  // S: "Cancelamento autorizado",
};

export const billStatusFormatter = (bill) => {
  const { status, pending } = bill;

  const isCancelled = bill?.cancelled === "P" || bill?.cancelled === "A" || bill?.cancelled === "F";

  const pedingStatus = status === "ABERTA" && pending && !isCancelled;

  if (pedingStatus || isCancelled) {
    return <Component bill={bill} pedingStatus={pedingStatus} />;
  }

  const statusStyles = {
    ABERTA: <span style={{ color: "red" }}>Aberta</span>,
    ESTORNADA: "Estornada",
    BAIXADA: <span style={{ color: "green" }}>Baixada</span>,
  };

  return cancelledStatus?.[bill?.cancelled] ? cancelledStatus[bill.cancelled]  : (statusStyles[status] || status);
};

export const statusBillText = (bill) => {

  if(bill?.cancelled === "P") {
    return "Pendente avaliação técnica"
  }

  if(bill?.cancelled === "F") {
    return "Pendente avaliação financeira"
  }

  if(bill?.cancelled === "A") {

    return "Finalizar cancelamento"
  }

  if(bill?.cancelled === "N") {

    return "Cancelamento não aprovado"
  }

  if(bill?.cancelled === "S") {
    return "Cancelamento aprovado"
  }

  return ""
}