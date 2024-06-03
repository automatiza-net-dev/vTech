import { useScheduling } from "@/presentation";
import { Button } from "infinity-forge";

import * as S from "./styles";

export function ButtonSetSchedulling(props) {
  const modalPatients = useScheduling((state) => state.modalPatients);
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  return (
    <S.ButtonSetSchedulling>
      <Button
        text="AGENDAR"
        type="button"
        onClick={() => {
          setCreateSchedulingArgs({
            ...modalPatients,
            ...props,
            type: "create",
          });
        }}
      />
    </S.ButtonSetSchedulling>
  );
}
