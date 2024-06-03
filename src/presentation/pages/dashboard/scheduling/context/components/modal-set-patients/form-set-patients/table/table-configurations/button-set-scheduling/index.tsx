import { Button, useToast } from "infinity-forge";

import {
  useScheduling,
  PermissionItem,
} from "@/presentation";

import * as S from "./styles";

export function ButtonSetSchedulling(props) {
  const modalPatients = useScheduling((state) => state.modalPatients);
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  const { toast } = useToast();

  return (
    <PermissionItem hash="AGE01">
      <S.ButtonSetSchedulling>
        <Button
          text="AGENDAR"
          type="button"
          onClick={() => {
            if (props.tutors.length === 0) {
              toast.error("Cadastre um tutor para agendar.", {
                autoClose: 4000,
                position: "top-right",
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
