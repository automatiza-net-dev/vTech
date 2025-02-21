import { Payment } from "@/domain";
import { Input, InputRadio } from "infinity-forge";

import * as S from "./styles";

export function ApproveCancelPayment(item: Payment & { index: number }) {
  const baseName = `billPayments.${item.id}`;

  if(!item.cancelled) {
    return <></>
  }

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
