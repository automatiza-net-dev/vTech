import { useFormikContext } from "formik";
import { Input, InputSwitch } from "infinity-forge";

import * as S from "./styles";

export function RolesControllerSearch() {

  return (
    <S.RolesControllerSearch>
      <Input name="rolesControllerSearch.name" label="Descrição" />

      <div className="switchs">
        <InputSwitch name="rolesControllerSearch.active" label="Ativo" />

        <div className="second">
          <InputSwitch
            name="rolesControllerSearch.externalAccess"
            label="Acesso externo"
          />
        </div>
      </div>
    </S.RolesControllerSearch>
  );
}
