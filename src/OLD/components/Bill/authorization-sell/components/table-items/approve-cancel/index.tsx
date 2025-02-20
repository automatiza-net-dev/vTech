import { getIn, useFormikContext } from "formik";
import { Input, InputRadio } from "infinity-forge";

import { Payment, Product } from "@/domain";

import * as S from "./styles";
import { useEffect, useMemo } from "react";

export function ApproveCancel(item: Product & { index: number }) {
  const { values, setFieldValue } = useFormikContext();

  const isActive = getIn(values, `billItems[${item.index}].cancelled`);

  useEffect(() => {
    if (isActive) {
      setFieldValue(`billItems[${item.index}].id`, item.id);
    }
  }, [isActive]);

  return (
    <S.Cancel>
      <InputRadio
        name={`billItems[${item.index}].cancelled`}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <div className="quantity">
        {isActive && <Input name={`billItems[${item.index}].note`} />}
      </div>
    </S.Cancel>
  );
}

export function ApproveCancelPayment(item: Payment & { index: number }) {
  const { values } = useFormikContext();

  const baseName = `billPayments.${item.id}.items[${item.index}]`;

  const isActive = getIn(values, `${baseName}.cancelled`);

  return (
    <S.Cancel>
      <InputRadio
        name={`${baseName}.cancelled`}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />
      
      <div style={{ display: "none" }}>
        <Input
          name={`${baseName}.id`}
          controlledInitialValue={{ value: item.id }}
        />
      </div>

      <div className="quantity">
        {isActive && <Input name={`${baseName}.note`} />}
      </div>
    </S.Cancel>
  );
}
