import {
  api,
  Error,
  Input,
  Accordion,
  FormHandler,
  LoaderCircle,
} from "infinity-forge";
import * as yup from "yup";
import { useQueryClient } from "react-query";

import {
  useLoadBill,
  usePermission,
  PermissionItem,
  AuthorizationPaymentForm,
} from "@/presentation";
import { Bill } from "@/domain";

import {
  TableItems,
  TablePayments,
  PaymentHeader,
  AuthorizationInformations,
} from "./components";

import * as S from "./styles";

export function AuthorizationSell(
  props: {
    onSuccess?: () => void;
  } & Partial<Bill>
) {
  const { data, isFetching } = useLoadBill(props);

  const hasPermissionToCancel = usePermission("VEN18");

  const queryClient = useQueryClient();

  const maxBlock =
    data?.payments?.reduce(
      (max, item) => (item?.block > max ? item.block : max),
      0
    ) || 0;

  if (isFetching) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  return (
    <Error name="AuthorizationSell">
      <S.AuthorizationSell>
        <AuthorizationInformations {...data} />

        <div className="form_cancel">
          <FormHandler
            onSucess={async (data) => {
              const payload = {
                cancelReason: data.cancelReason,
                userEmail: data.userEmail,
                userPwd: data.userPwd,
                billId: props.id,
                billItems: data.billItems
                  ?.filter((item) => item.active)
                  .map((item) => ({
                    ...item,
                    quantity: Number(item.quantity || 0),
                  })),
                billPayments: data.billPayments?.filter((item) => !!item),
                notes: " ",
              };

              await api({
                url: "bills/request-cancellation",
                method: "post",
                body: payload,
              });

              await queryClient.invalidateQueries({
                queryKey: ["bills", true],
              });

              await queryClient.invalidateQueries({
                queryKey: ["bills", false],
              });

              props.onSuccess && props?.onSuccess();
            }}
            schema={{
              userEmail: yup.string().required("Campo requerido"),
              userPwd: yup.string().required("Campo requerido"),
            }}
            button={
              data.cancelled
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
            {!props.cancelled && (
              <PermissionItem hash="VEN18">
                <div className="row">
                  <Input name="userEmail" label="Email" />
                  <Input label="Senha" name="userPwd" />
                  <Input label="Motivo do cancelamento" name="cancelReason" />
                </div>
              </PermissionItem>
            )}

            <TableItems {...data} />

            {Array.from({ length: maxBlock }).map((_, index) => {
              const paymentsList = data.payments.filter(
                (payment) => payment.block === index + 1
              );

              return (
                <Accordion
                  key={index + "block"}
                  Header={() => <PaymentHeader paymentsList={paymentsList} />}
                >
                  <TablePayments
                    paymentsList={paymentsList}
                    cancelled={props.cancelled}
                  />
                </Accordion>
              );
            })}
          </FormHandler>
        </div>

        {data && !props.cancelled && (
          <AuthorizationPaymentForm
            auth={"VEN16"}
            bill={data}
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: ["RemoteLoadBill", false],
              });

              await queryClient.invalidateQueries({
                queryKey: ["RemoteLoadBill", true],
              });
            }}
          />
        )}
      </S.AuthorizationSell>
    </Error>
  );
}
