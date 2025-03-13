import { useState } from "react";
import { Modal, Tooltip } from "infinity-forge";

import { MdMonetizationOn } from "react-icons/md";
import Negotiation from "@/OLD/components/Budget/Negotiation";

import { useDictionary, usePermission } from "@/presentation";

export default function AddPaymentPreview({
  budgetId,
  budgetTag,
}: {
  budgetId: string;
  budgetTag: string;
}) {
  const hasPermission = usePermission("ORC02");
  const [visible, setVisible] = useState(false);

  const { getWord } = useDictionary();

  if (!budgetTag || !budgetId || !hasPermission) {
    return <></>;
  }

  return (
    <>
      <Tooltip
        idTooltip="add-payment-prev"
        content="Lançar Pagamentos"
        enableHover
        trigger={
          <MdMonetizationOn
            onClick={() => setVisible(true)}
            size={20}
            className="icon"
          />
        }
      />

      <Modal
        open={visible}
        styles={{ maxWidth: 1300 }}
        onClose={() => setVisible(false)}
      >
        <h2>{`Adicionar Item ao ${getWord("Orçamento")} - ${budgetTag}`}</h2>
        <Negotiation budgetId={budgetId} />
      </Modal>
    </>
  );
}
