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
        <Services />

        <div style={{ width: "100%" }}>
          <Departaments />
          <DepartamentItems />
        </div>
      </div>

      <ServicesSelected />
    </S.CreateOdontogram>
  );
}
