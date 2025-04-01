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

        <div style={{ width: "100%" }}>
          <DepartamentItems />

          <ServicesSelected />
        </div>

        <Services />

      </div>
    </S.CreateOdontogram>
  );
}
