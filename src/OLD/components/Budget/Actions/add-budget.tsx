import { useState } from "react";
import { Modal, Tooltip } from "infinity-forge";

import { GrAddCircle } from "react-icons/gr";

import { AddBudgetNew, usePermission } from "@/presentation";

export default function AddBudget({ budgetId }: { budgetId: string }) {
  const hasPermission = usePermission("ORC02");

  const [open, setOpen] = useState(false);

  if (!budgetId || !hasPermission) {
    return <></>;
  }

  return (
    <>
      <Tooltip
        idTooltip="add-item"
        content="Adicionar Item"
        enableHover
        trigger={
          <GrAddCircle
            className="icon"
            size={20}
            onClick={() => setOpen(true)}
          />
        }
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        {open && <AddBudgetNew budgetId={budgetId} setModal={setOpen} />}
      </Modal>
    </>
  );
}
