import * as yup from "yup";
import moment from "moment";
import { useQueryClient } from "react-query";
import {
  Accordion,
  api,
  Error,
  FormHandler,
  Input,
  LoaderCircle,
} from "infinity-forge";

import {
  useLoadBill,
  usePermission,
  PermissionItem,
  AuthorizationPaymentForm,
} from "@/presentation";
import { Bill } from "@/domain";

import { authorizationFormater } from "./utils";
import {
  TablePayments,
  TableItems,
  PaymentHeader,
  AuthorizationInformations,
} from "./components";

import * as S from "./styles";

export function AuthorizationSell(
  props: {
    cancelled?: boolean;
  } & Partial<Bill>
) {
  const { data, isFetching } = useLoadBill({ id: props.id });

  const hasPermissionToCancel = usePermission("VEN18");

  const queryClient = useQueryClient();

  if (isFetching) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  const maxBlock =
    data?.payments?.reduce(
      (max, item) => (item?.block > max ? item.block : max),
      0
    ) || 0;

  return (
    <Error name="AuthorizationSell">
      <S.AuthorizationSell>
        <AuthorizationInformations {...data} />

        <div className="form_cancel">
          <FormHandler
            onSucess={async (data) => {
              console.log(data)

              const payload = {
                ...data,
                billId: props.id,
                billItems: data.billItems?.filter((item) => item.active).map(item => ({...item, quantity: Number(item.quantity || 0)})),
                billPayments: data.billPayments?.filter(item => !!item),
              };

              await api({
                url: "bills/request-cancellation",
                method: "post",
                body: payload,
              });
            }}
            schema={{
              userEmail: yup.string().required("Campo requerido"),
              userPwd: yup.string().required("Campo requerido"),
            }}
            button={
              props.cancelled
                ? {
                    text: hasPermissionToCancel
                      ? "CANCELAR"
                      : "Usuario não possui permissão para solicitar o cancelamento de vendas",
                    disabled: !hasPermissionToCancel,
                  }
                : undefined
            }
            disableEnterKeySubmitForm
            cleanFieldsOnSubmit={false}
            isStickyButtons
          >
            {props.cancelled && (
              <PermissionItem hash="VEN18">
                <div className="row">
                  <Input name="userEmail" label="Email" />
                  <Input label="Senha" name="userPwd" />
                  <Input label="Motivo do cancelamento" name="cancelReason" />
                </div>
              </PermissionItem>
            )}

            <TableItems {...data} cancelled={props.cancelled} />

           {Array.from({ length: maxBlock }).map((_, index) => {
            const paymentsList = data.payments.filter(payment => payment.block === index + 1);

              return (
                <Accordion
                  key={index + "block"}
                  Header={() => <PaymentHeader paymentsList={paymentsList} />}
                >
                 
                  <TablePayments paymentsList={paymentsList} cancelled={props.cancelled} /> 
                </Accordion>
              );
            })} 
          </FormHandler>
        </div>

        {data && (
          <AuthorizationPaymentForm
            auth={"VEN16"}
            bill={data}
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: ["RemoteLoadBill", props.cancelled],
              });
            }}
          />
        )}
      </S.AuthorizationSell>
    </Error>
  );
}
