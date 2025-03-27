import {
  DepartamentItems,
  Departaments,
  Services,
  ServicesSelected,
} from "./components";

import * as S from "./styles";

export function CreateOdontogram() {
  return (
    <S.CreateOdontogram>
      <Departaments />

      <div className="container_orcamento">
        <Services />

        <DepartamentItems />
      </div>

      <ServicesSelected />
    </S.CreateOdontogram>
  );
}
