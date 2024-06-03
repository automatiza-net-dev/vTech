import { Button } from "infinity-forge";
import { useHistory } from "@/presentation";

import * as S from "./styles";

export function GoBackRoute() {
  const { history, atualRoute, back } = useHistory();

  if (!history || history.length === 0 || history[0] === atualRoute) {
    return <></>;
  }

  // icon={<ArrowBackIcon fontSize="large" color="error" />}
  // variant="text"

  return (
    <S.ButtonGoBack>
      <Button text="Voltar" color="error" onClick={back}></Button>
    </S.ButtonGoBack>
  );
}
