import { Input, InputRadio } from "infinity-forge";

import { Product } from "@/domain";

import * as S from "./styles";

export function ApproveCancel(item: Product & { index: number }) {

  const baseName = `billItems.${item.id}`;


  return (
    <S.Cancel>
 <InputRadio
        name={`${baseName}.cancelled`}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <Input name={`${baseName}.note`} />
    </S.Cancel>
  );
}

