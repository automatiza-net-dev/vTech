import {
  Input,
  InputPassword,
  InputRadio,
  InputSwitch,
  TextEditor,
} from "infinity-forge";

import { Bill } from "@/domain";

import * as S from "./styles";
import { useFormikContext } from "formik";

export function ApproveCancelGlobal({
  cancelled,
}: {
  cancelled: Bill["cancelled"];
}) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <S.Cancel>
      <div>
        <TextEditor
          disableToolbar
          name={`notes`}
          label={
            cancelled === "P"
              ? "Observação avaliação técnica"
              : cancelled === "A"
              ? "Observações do cancelamento"
              : cancelled === "F"
              ? "Observação avaliação financeira"
              : "Motivo do cancelamento"
          }
        />
      </div>

      <div>
        {(cancelled === "P" || cancelled === "A") && (
          <InputRadio
            name={`cancelled`}
            label={
              cancelled === "P"
                ? "Avaliação técnica"
                : cancelled === "A"
                ? "Aprovar cancelamento?"
                : ""
            }
            options={[
              {
                label: "Aprovado",
                value: "true",
              },
              {
                label: "Não aprovado",
                value: "false",
              },
            ]}
          />
        )}

        <Input name="userEmail" label="Email" />
        <InputPassword label="Senha" name="userPwd" />

        {cancelled === "F" && (
          <InputSwitch
            name="noPayments"
            label="Não cancelar nenhum pagamento"
            onChangeInput={(value) => {
              if (value === true) {

                const newBillPayments = Object.keys((values as any)?.billPayments || {}).reduce((reducer, item) => {
                  return {...reducer, [item]: {}}
                }, {})

                setFieldValue("billPayments", newBillPayments);
              }
            }}
          />
        )}
      </div>
    </S.Cancel>
  );
}
