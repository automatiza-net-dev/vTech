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

     {/* <div className="content_create">
        <Services />

        <div>
          <DepartamentItems />

          <ServicesSelected />
        </div>
      </div>  */}
    </S.CreateOdontogram>
  );
}
