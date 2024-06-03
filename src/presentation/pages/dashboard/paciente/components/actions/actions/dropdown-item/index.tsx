import { Dispatch, SetStateAction, useState } from "react";

import { DropdownItem } from "semantic-ui-react";

import { Modal } from "@/presentation";

import * as S from "./styles";

export type DropdownComponentProps = {
  setModal: Dispatch<SetStateAction<boolean>>;
};

export type DropdownItemActionProps = {
  Icon: any;
  label: string;
  Component: (props: DropdownComponentProps) => JSX.Element;
};

export function DropdownItemAction({
  Component,
  Icon,
  label,
}: DropdownItemActionProps) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal maxwidth="1024px" stateModal={modal} setModal={setModal}>
        <S.ModalContent>
          <Component setModal={setModal} />
        </S.ModalContent>
      </Modal>

      <DropdownItem onClick={() => setModal(true)}>
        {Icon && Icon}

        {label && <span>{label}</span>}
      </DropdownItem>
    </>
  );
}
