import { Error, Button } from "infinity-forge";

import { Actions } from "./actions";
import { FinishService } from "./finish-service";
import { Hospitalization } from "./hospitalization";

import * as S from "./styles";

export function ActionsPatient() {
  return (
    <Error name="Actions">
      <S.Actions>
        <div className="box">
          <Hospitalization />

          <Button svg="IconCalendar"  href="/dashboard/agenda" text="AGENDA" />

          <Actions />
        </div>

        <FinishService />
      </S.Actions>
    </Error>
  );
}
