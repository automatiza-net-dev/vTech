import { InputCheckbox } from "infinity-forge";

import { Bill, Payment } from "@/domain";

import { useFormikContext } from "formik";

import * as S from "./styles";

export function ApproveCancelPaymentF(
  item: Payment & { index: number; cancelledStatus?: Bill["cancelled"] }
) {
  const baseName = `billPayments.${item.id}`;

  const { values } = useFormikContext<{ noPayments?: boolean }>();
  // const value = getIn(values, `${baseName}.cancelled`);

  if (item.cancelledStatus === "P" || item?.finance?.payment_date) {
    return <></>;
  }

  return (
    <S.Cancel>
      <InputCheckbox
        disabled={!!values?.noPayments}
        name={`${baseName}.cancelled`}
        options={[{ label: "Cancelar", value: "Sim" }]}
      /> 

      {/* {value?.includes("Sim") && <Input name={`${baseName}.note`} />} */}
    </S.Cancel>
  );
}
