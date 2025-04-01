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
      <div className="content">
      <Departaments />

        <div className="mid">
          <DepartamentItems />

          <ServicesSelected />
        </div>

        <Services />

      </div>
    </S.CreateOdontogram>
  );
}
