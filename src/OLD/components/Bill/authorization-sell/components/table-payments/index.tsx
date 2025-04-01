import { useTable, formatNumberToCurrency } from "infinity-forge";

import moment from "moment";

import { Bill, Payment } from "@/domain";
import { ApproveCancelPaymentF } from "./approve-cancel-paymebt-f";

export function TablePayments(props: {
  paymentsList: Payment[];
  isCancelled?: boolean;
  cancelledStatus?: Bill["cancelled"];
}) {
  // const hasPermission = useUserHasPermission("VEN20");

  const { Table } = useTable({
    configs: {
      errorMessage: "Não possui pagamentos",
      tableData: props.paymentsList,
      tableKeyItem: "id",
    },
    columnsConfiguration: {
      columns: [
        {
          id: "created_at",
          label: "Data",
          Component: {
            Element: (payment) => {
              return (
                <p className="font-16-regular">
                  {payment?.created_at
                    ? moment(payment?.created_at).format("DD/MM/YYYY - HH:MM")
                    : "---"}
                </p>
              );
            },
            props: {},
            
          },
        },
        {
          id: "total_value",
          label: "Valor",
          Component: {
            Element: (payment) => {
              return (
                <p className="font-16-regular">
                  {formatNumberToCurrency(payment.total_value)}
                </p>
              );
            },
          },
        },
        {
          id: "paymentMethod",
          label: "Forma pagamento",
          Component: {
            Element: (payment) => {
              return (
                <p className="font-16-regular">
                  {payment.paymentMethod.description}
                </p>
              );
            },
          },
        },
        {
          id: "finance",
          label: "Data de pagamento",
          Component: {
            Element: (payment) => {
              return (
                <p className="font-16-regular">
                  {payment?.finance?.payment_date
                    ? moment(payment?.finance?.payment_date).format(
                        "DD/MM/YYYY"
                      )
                    : "Em aberto"}
                </p>
              );
            },
          },
        },
        {
          id: "nsu_document",
          label: "Comprovante/NSU",
        },
        // {
        //   label: "Dados Autorização",
        //   id: "authorization",
        // },
        // {
        //   id: "id",
        //   label: "Cancelar",
        //   enabled: props.isCancelled && props?.cancelledStatus === "F",
        //   Component: {
        //     Element: (payment) => {
        //       return (
        //         <div
        //           className="uk-flex"
        //           style={{ gap: "10px", alignItems: "center" }}
        //         >
        //           <InputSwitch
        //             onChangeInput={(value) => {
        //               if (value) {
        //                 const actualValues = values?.["billPayments"]
        //                   ? [...values["billPayments"], payment.id]
        //                   : [payment.id];
        //                 setFieldValue("billPayments", actualValues);
        //               } else {
        //                 setFieldValue(
        //                   "billPayments",
        //                   values?.["billPayments"]?.filter(
        //                     (item) => item !== payment.id
        //                   )
        //                 );
        //               }
        //             }}
        //             name={`activePayment${payment.id}`}
        //             options={[{ label: "", value: payment.id }]}
        //           />
        //         </div>
        //       );
        //     },
        //     props: {},
        //     
        //   },
        // },
        {
          id: "custom3" as any,
          label: "Autorização",
          enabled: props.cancelledStatus === "F",
          Component: {
            Element: (item) => (
              <ApproveCancelPaymentF
                {...(item as any)}
                cancelledStatus={props.cancelledStatus}
              />
            ),
          },
        },
        {
          id: "custom4" as any,
          label: "Autorização",
          enabled: props.isCancelled && props.cancelledStatus === "A",
          Component: {
            Element: (item: any) => {
              if (item.cancelled === "S" || item.cancelled === "N") {
                return (
                  <p className="font-14-bold">
                    {item.cancelled === "S" ? "Aprovado" : "Não aprovado"}{" "}
                    <br /> <div dangerouslySetInnerHTML={{ __html: item?.reviewCancelNotes || "Sem obs" }} /> 
                  </p>
                );
              }

              return <></>;
            },
          },
        },
      ],
    },
  });

  if (!props.paymentsList || props.paymentsList.length === 0) {
    return <></>;
  }

  return <div className="payments">{Table}</div>;
}
