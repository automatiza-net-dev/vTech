import { Error, Button } from "infinity-forge";

import { useActionsPatient } from "./options";
import { DropdownItemAction } from "./dropdown-item";

import * as S from "./styles";
import { useLoadPatient } from "@/presentation/hooks";

export function Actions({ reloadSchedule }: { reloadSchedule: any }) {
  const patient = useLoadPatient();
  const actionsPatient = useActionsPatient(patient?.data);

  const hasOpenAttendances = patient.data?.openAttendances || true;
  const defaultValueFn = (label: string) => {
    return ["Avaliação", "Atendimentos"].includes(label)
      ? !hasOpenAttendances
      : false;
  };

  return (
    <Error name="AddButton">
      <S.Actions>
        <div className="hover_container">
          <Button svg="IconPlusSharp" text="ADICIONAR" />

          <div className="sub_menu">
            {actionsPatient.activeActions.map((option) => (
              <DropdownItemAction
                key={option.value}
                {...option}
                defaultValue={defaultValueFn(option.label)}
                reloadSchedule={reloadSchedule}
              />
            ))}
          </div>
        </div>
      </S.Actions>
    </Error>
  );
}
