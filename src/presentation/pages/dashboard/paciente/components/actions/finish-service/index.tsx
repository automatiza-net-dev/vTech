import { Error } from "@/presentation";

import { Button } from "infinity-forge";

export function FinishService() {
  async function finalizarAtendiemnto() {}

  return (
    <Error name="FinishService">
      <Button
        text="Finalizar Atendimento"
        onClick={finalizarAtendiemnto}
      />
    </Error>
  );
}
