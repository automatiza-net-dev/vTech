import { Bill } from "@/domain";
import { AddSale } from "@/presentation";
import { Icon, Modal, Tooltip } from "infinity-forge";
import { useState } from "react";
import styled from "styled-components";

export default function AddBillItem({ bill }: { bill: Bill }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        onClose={() => setOpen(false)}
        open={open}
        styles={{ maxWidth: "1200px" }}
      >
        <AddSale setModal={setOpen} billId={bill?.id} type="edit" />
      </Modal>

      <Tooltip
        idTooltip="test"
        enableHover
        position="top-right"
        content={"Adicionar Itens na Venda"}
        trigger={
          <Button
            type="button"
            style={{ background: "transparent", padding: 0, border: 0 }}
            onClick={() => setOpen(true)}
          >
            <Icon name="IconEdit" color="#000" />
          </Button>
        }
      />
    </>
  );
}

export const Button = styled.button`
  svg {
    height: 20px;
    width: auto;
  }
`;
