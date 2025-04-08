import { Input, InputSwitch } from "infinity-forge";

import * as S from "./styles";

export function RolesControllerSearch() {

  return (
    <S.RolesControllerSearch>
      <Input name="name" label="Descrição" />

      <div className="switchs">
        <InputSwitch   design="checkbox" name="active" label="Ativo" />

        <div className="second">
          <InputSwitch
          design="checkbox"
            name="externalAccess"
            label="Acesso externo"
          />
        </div>
      </div>
    </S.RolesControllerSearch>
  );
}
