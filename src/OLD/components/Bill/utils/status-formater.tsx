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
        {pedingStatus ? "Pendente" : "Pendente cancelamento"}
      </button>

      <Modal
        open={visible}
        onClose={() => setVisible(false)}
        styles={{ maxWidth: 1400 }}
      >
        <AuthorizationSell {...bill} onSuccess={() => setVisible(false)} />
      </Modal>
    </>
  );
}

export const cancelledStatus = {
  P: "Cancelamento pendente",
  A: "Cancelamento avaliado",
  N: "Cancelamento não autorizado",
  S: "Cancelamento autorizaado",
};

export const billStatusFormatter = (bill) => {
  const { status, pending } = bill;
  const pedingStatus = status === "ABERTA" && pending;

  if (pedingStatus || bill?.cancelled === "P" || bill?.cancelled === "A") {
    return <Component bill={bill} pedingStatus={pedingStatus} />;
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
