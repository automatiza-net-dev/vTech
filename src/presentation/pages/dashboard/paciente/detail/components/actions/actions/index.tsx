import { Error, Button } from "infinity-forge";

import { useActionsPatient } from "./options";
import { DropdownItemAction } from "./dropdown-item";

import * as S from "./styles";

export function Actions() {
  const actionsPatient = useActionsPatient();

  return (
    <Error name="AddButton">
      <S.Actions>
        <div className="hover_container">
          <Button svg="IconPlusSharp" text="ADICIONAR" />

          <div className="sub_menu">
            {actionsPatient.activeActions.map((option) => (
              <DropdownItemAction key={option.value} {...option} />
            ))}
          </div>
        </div>
      </S.Actions>
    </Error>
  );
}
