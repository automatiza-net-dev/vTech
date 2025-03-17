import {
  api,
  Input,
  InputPassword,
  InputRadio,
  InputSwitch,
  Select,
  TextEditor,
  useAuthAdmin,
  useQuery,
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

  const { user } = useAuthAdmin();

  const { data, isFetching } = useQuery({
    queryKey: ["search-deposits", user?.unit?.id],
    queryFn: async () => {
      const response = await api({
        url: "deposits/search-deposits",
        method: "get",
        body: { unitId: user?.unit?.id, status: "Ativo", type: "Venda" },
      });
      return response as any[];
    },
    enabled: cancelled === "A" && !!user?.unit?.id,
  });



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

        {cancelled === "A" && user?.unit?.configs?.businessUnits?.controls_deposit === true && (
          <Select
            label="Depósito estoque - devolução cancelamento"
            name="depositId"
            loading={isFetching}
            onlyOneValue
            options={
              data?.map((item) => ({
                label:
                  item?.description + " " + item.principal ? "Principal" : "",
                value: item?.id,
              })) || []
            }
          />
        )}

        <div className="row">
          <Input name="userEmail" label="Email" />

          <InputPassword label="Senha" name="userPwd" />
        </div>

        {cancelled === "F" && (
          <InputSwitch
            name="noPayments"
            label="Não cancelar nenhum pagamento"
            design="checkbox"
            onChangeInput={(value) => {
              if (value === true) {
                const newBillPayments = Object.keys(
                  (values as any)?.billPayments || {}
                ).reduce((reducer, item) => {
                  return { ...reducer, [item]: {} };
                }, {});

                setFieldValue("billPayments", newBillPayments);
              }
            }}
          />
        )}
      </div>
    </S.Cancel>
  );
}
