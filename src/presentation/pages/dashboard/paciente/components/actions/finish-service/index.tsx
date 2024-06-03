import { Error } from "infinity-forge";

import { Button } from "infinity-forge";
import { EndAttendanceButton } from "@/OLD/components/Attendance/EndAttendanceButton";

export function FinishService() {
  async function finalizarAtendiemnto() {}

  return (
    <Error name="FinishService">
      <EndAttendanceButton />

      {/*
      <Button
        svg="IconDoor"
        text="FINALIZAR ATENDIMENTO"
        onClick={finalizarAtendiemnto}
      />
      */}
    </Error>
  );
}
