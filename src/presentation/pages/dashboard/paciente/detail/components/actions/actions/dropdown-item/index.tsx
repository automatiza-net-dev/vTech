import { Dispatch, SetStateAction, useState } from "react";

import { TimeLine } from "@/domain";
import { Modal } from "infinity-forge";

import * as S from "./styles";

export type DropdownComponentProps = {
  modal?: boolean;
  setModal?: Dispatch<SetStateAction<boolean>>;
  value?: string;
} & Partial<TimeLine>;

export type DropdownItemActionProps = {
  Icon: any;
  label: string;
  customModalStyles?: {};
  Component?: (props: DropdownComponentProps) => JSX.Element;
  value?: string;
};

export function DropdownItemAction({
  Icon,
  label,
  Component,
  value,
}: DropdownItemActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        styles={{
          maxWidth: "1200px",
          padding: "10px",
          width: "100%",
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <S.ModalContent>
          {Component && (
            <Component modal={open} setModal={setOpen} value={value} />
          )}
        </S.ModalContent>
      </Modal>

      <button type="button" onClick={() => setOpen(true)}>
        {Icon && Icon}

        {label && <span>{label}</span>}
      </button>
    </>
  );
}
