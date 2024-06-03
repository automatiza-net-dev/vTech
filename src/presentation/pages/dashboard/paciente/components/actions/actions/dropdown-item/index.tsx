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
  Component?: (props: DropdownComponentProps) => JSX.Element;
};

export function DropdownItemAction({
  Component,
  Icon,
  label,
}: DropdownItemActionProps) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal
        trigger={
          <button type="button" onClick={() => setModal(true)}>
            {Icon && Icon}

            {label && <span>{label}</span>}
          </button>
        }
        style={{ maxWidth: "1024px", maxHeight: "90vh", overflow: "auto", padding: 30 }}
        modal={modal}
        setModal={setModal}
      >
        <S.ModalContent>
          {Component && <Component modal={modal} setModal={setModal} />}
        </S.ModalContent>
      </Modal>
    </>
  );
}
