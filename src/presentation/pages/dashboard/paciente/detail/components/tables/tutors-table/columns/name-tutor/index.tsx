import { useState } from "react";

import { Modal } from "@/presentation";
import { Single } from "@/OLD/components/Tutor/Single"

import * as S from "./styles";

export function NameTutor(props) {
  const [modal, setModal] = useState(false);

  return (
    <S.NameTutor>
      <Modal maxwidth="1200px" stateModal={modal} setModal={setModal}>
        <Single
          {...props}
          setVisible={setModal}
          selectedId={props?.id}
        />
      </Modal>
      {props?.name && (
        <span className="custom-link" onClick={() => setModal(true)}>
          {props.name}
        </span>
      )}
    </S.NameTutor>
  );
}
