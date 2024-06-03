import { Error } from "@/presentation";
import { Button } from "infinity-forge";

import { Actions } from "./actions";
import { Hospitalization } from "./hospitalization";

import * as S from "./styles";

export function ActionsPatient() {
  return (
    <Error name="Actions">
      <S.Actions>
        <div className="box">
          <Hospitalization />

          <Button href="/dashboard/agenda" text="AGENDA" />

          <Actions />
        </div>

        {/* <EndService patientId={patient.id}/> */}
      </S.Actions>
    </Error>
  );
}
