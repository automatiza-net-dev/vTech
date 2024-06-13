import { Dispatch, SetStateAction, useState } from "react";

import { TimeLine } from "@/domain";
import { Modal } from "infinity-forge";

import * as S from "./styles";

export type DropdownComponentProps = {
  modal?: boolean;
  setModal?: Dispatch<SetStateAction<boolean>>;
} & Partial<TimeLine>;

export type DropdownItemActionProps = {
  Icon: any;
  label: string;
  customModalStyles?: {};
  Component?: (props: DropdownComponentProps) => JSX.Element;
};

export function DropdownItemAction({
  Component,
  Icon,
  label,
  customModalStyles,
}: DropdownItemActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        styles={{
          maxWidth: "1024px",
          maxHeight: "95vh",
          overflow: "auto",
          ...customModalStyles,
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <S.ModalContent>
          {Component && <Component modal={open} setModal={setOpen} />}
        </S.ModalContent>
      </Modal>

      <button type="button" onClick={() => setOpen(true)}>
        {Icon && Icon}

        {label && <span>{label}</span>}
      </button>
    </>
  );
}
