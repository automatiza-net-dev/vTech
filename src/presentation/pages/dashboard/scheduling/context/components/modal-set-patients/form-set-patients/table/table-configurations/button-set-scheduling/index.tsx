import { useState } from "react";

import { Button, useToast } from "infinity-forge";

import { useScheduling, PermissionItem } from "@/presentation";

import { ModalSelectActiveTutor } from "../modal-select-active-tutor";

import * as S from "./styles";

export function ButtonSetSchedulling(props) {
  const [modal, setModal] = useState(false);

  const modalPatients = useScheduling((state) => state.modalPatients);
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  const { createToast } = useToast();

  const hasActiveTutor = !!(
    props.tutors.length > 0 && props.tutors.find((tutor) => tutor.isMain)
  );

  return (
    <PermissionItem hash="AGE01">
      <S.ButtonSetSchedulling>
        <ModalSelectActiveTutor {...props} modal={modal} setModal={setModal}/>

        <Button
          text="AGENDAR"
          type="button"
          onClick={() => {
            if(!hasActiveTutor) {
              setModal(true);

              return;
            }

            if (props.tutors.length === 0) {
              createToast({
                message: "Cadastre um tutor para agendar.",
                status: "error",
              });

              return;
            }

            setCreateSchedulingArgs({
              ...modalPatients,
              ...props,
              type: "create",
            });
          }}
        />
      </S.ButtonSetSchedulling>
    </PermissionItem>
  );
}
