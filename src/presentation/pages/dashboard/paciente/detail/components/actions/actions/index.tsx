import { Error, Button, useQueryClient } from "infinity-forge";

import { useActionsPatient } from "./options";
import { DropdownItemAction } from "./dropdown-item";

import * as S from "./styles";
import { useLoadPatient } from "@/presentation/hooks";
import { useDictionary } from "@/presentation";

export function Actions({ reloadSchedule }: { reloadSchedule: any }) {
  const patient = useLoadPatient();
  const actionsPatient = useActionsPatient(patient?.data);
  const queryClient = useQueryClient();
  const { getWord } = useDictionary();

  const hasOpenAttendances = patient.data
    ? patient.data?.openAttendances
    : true;
  const defaultValueFn = (label: string) => {
    return ["Avaliação", "Atendimentos"].includes(label)
      ? !hasOpenAttendances
      : false;
  };

  const handleBudgetSuccess = () => {
    queryClient.invalidateQueries(["sales-metadata", patient.data?.id]);
    queryClient.invalidateQueries(["openNegotiations", patient.data?.id]);
    queryClient.refetch(["LastUpdates"], { mode: "include" });
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
                onSuccess={option.value === getWord("Orçamentos") ? handleBudgetSuccess : undefined}
              />
            ))}
          </div>
        </div>
      </S.Actions>
    </Error>
  );
}
