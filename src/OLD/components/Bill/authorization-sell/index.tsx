import { Fragment } from "react";

import {
  Error,
  Input,
  Accordion,
  InputRadio,
  FormHandler,
  LoaderCircle,
  InputPassword,
} from "infinity-forge";
import * as yup from "yup";
import { useQueryClient } from "infinity-forge";

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
import {
  onSubmitAprroveCancel,
  onSubmitAprroveCancelF,
  onSubmitCancel,
  onSubmitFinishCancel,
} from "./submit-cancel";

import * as S from "./styles";
import { ApproveCancelGlobal } from "./components/approve-cancel-global";

export function AuthorizationSell(
  props: {
    isCancelled?: boolean;
    onSuccess?: () => void;
  } & Partial<Bill>
) {
  const { data, isFetching } = useLoadBill(props);

  const hasPermissionToCancel = usePermission("VEN18");
  const hasPermissionToCancelItems = usePermission("VEN19");
  const hasPermissionToCancelPayments = usePermission("VEN20");

  const queryClient = useQueryClient();

  const maxBlock =
    data?.payments?.reduce(
      (max, item) => (item?.block > max ? item.block : max),
      0
    ) || 0;

  if (isFetching) {
    return <LoaderCircle size={30} color="#ccc" />;
  }

  const schema =
    data.cancelled === "P"
      ? {
          // billItems: yup
          //   .object()
          //   .nullable()
          //   .test("billItems", "Validação de billItems", function (value) {
          //     if (!value) {
          //       return true;
          //     }
          //     for (const key of Object.keys(value)) {
          //       const item = value[key];
          //       if (!item.note) {
          //         return this.createError({
          //           path: `billItems.${key}.note`,
          //           message: "Campo requerido",
          //         });
          //       }
          //     }
          //     return true;
          //   }),
          // billPayments: yup
          //   .object()
          //   .nullable()
          //   .test(
          //     "billPayments",
          //     "Validação de billPayments",
          //     function (value) {
          //       if (!value) {
          //         return true;
          //       }
          //       for (const key of Object.keys(value)) {
          //         const item = value[key];
          //         if (!item.note) {
          //           return this.createError({
          //             path: `billPayments.${key}.note`,
          //             message: "Campo requerido",
          //           });
          //         }
          //       }
          //       return true;
          //     }
          //   ),
        }
      : data.cancelled === "A"
      ? {
          cancelled: yup.string().required("Campo requerido"),
        }
      : {};

  const maxBlocks = Array.from({ length: maxBlock });

  return (
    <Error name="AuthorizationSell">
      <S.AuthorizationSell>
        <AuthorizationInformations {...data} />

        <div className="form_cancel">
          <FormHandler
            debugMode
            onSucess={async (formData) => {
              console.log(formData)
              if (props.cancelled === "F") {
                await onSubmitAprroveCancelF({ formData, props });
              }

              if (props.cancelled === "A") {
                await onSubmitFinishCancel({ formData, props });
              }

              if (props.cancelled === "P") {
                await onSubmitAprroveCancel({
                  items: data.items,
                  formData,
                  props,
                });
              }

              if (!props.cancelled || props?.cancelled === "N") {
                await onSubmitCancel({ formData, props });
              }

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
              ...schema,
            }}
            button={
              props?.isCancelled && props?.cancelled === "A"
                ? { text: "FINALIZAR CANCELAMENTO" }
                : props?.isCancelled && props?.cancelled === "P"
                ? hasPermissionToCancelItems || hasPermissionToCancelPayments
                  ? {
                      text: "SALVAR AVALIAÇÃO",
                    }
                  : undefined
                : props?.isCancelled
                ? {
                    text: hasPermissionToCancel
                      ? "SOLICITAR CANCELAMENTO"
                      : "Usuario não possui permissão para solicitar o cancelamento de vendas",
                    disabled: !hasPermissionToCancel,
                  }
                : undefined
            }
            disableEnterKeySubmitForm
            cleanFieldsOnSubmit={false}
            isStickyButtons
          >
            {(props?.isCancelled || props.cancelled === "P" || props.cancelled === "A") && (
              <PermissionItem hash="VEN18">
                  <ApproveCancelGlobal bill={data} cancelled={props.cancelled} />
              </PermissionItem>
            )}

            <TableItems {...data} isCancelled={props.isCancelled} />

            {maxBlocks.map((_, index) => {
              const paymentsList = data.payments.filter(
                (payment) => payment.block === index + 1
              );

              if (!paymentsList || paymentsList.length === 0) {
                return <Fragment key={index + "block"} />;
              }

              return (
                <Accordion
                  key={
                    paymentsList.reduce(
                      (reducer, item) => reducer + item.id,
                      ""
                    ) || ""
                  }
                  Header={() => <PaymentHeader paymentsList={paymentsList} />}
                >
                  <TablePayments
                    paymentsList={paymentsList}
                    isCancelled={props?.isCancelled}
                    cancelledStatus={props.cancelled}
                  />
                </Accordion>
              );
            })}
          </FormHandler>
        </div>

        <div className="authorization_form">
          {data && !props.isCancelled && (
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

                props.onSuccess && props?.onSuccess();
              }}
            />
          )}
        </div>
      </S.AuthorizationSell>
    </Error>
  );
}
