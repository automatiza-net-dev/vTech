import { InputRadio, TextEditor } from "infinity-forge";

import * as S from "./styles";

export function ApproveCancelGlobal() {
  return (
    <S.Cancel>
      <div style={{ width: 110 }}>
        <InputRadio
          name={`cancelled`}
          options={[
            { label: "Sim", value: "Sim" },
            { label: "Não", value: "Não" },
          ]}
        />
      </div>

      <div style={{ width: "100%" }}>
        <TextEditor disableToolbar name={`note`} />
      </div>
    </S.Cancel>
  );
}
