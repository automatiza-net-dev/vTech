import { useTable, InputSwitch, formatNumberToCurrency } from "infinity-forge";
import moment from "moment";
import { useFormikContext } from "formik";

import { Payment } from "@/domain";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export function TablePayments(props: {
  paymentsList: Payment[];
  cancelled?: boolean;
  cancelledStatus?: "P" | "A";
}) {
  const { values, setFieldValue } = useFormikContext();
  const hasPermission = useUserHasPermission("VEN20");

  const { Table } = useTable({
    configs: {
      errorMessage: "Não possui pagamentos",
      tableData: props.paymentsList,
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
            allProps: true,
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
          id: "nsu_document",
          label: "Comprovante/NSU",
        },
        // {
        //   label: "Dados Autorização",
        //   id: "authorization",
        // },
        {
          id: "id",
          label: "Cancelar",
          enabled: !!props.cancelled && !props?.cancelledStatus,
          Component: {
            Element: (payment) => {
              return (
                <div
                  className="uk-flex"
                  style={{ gap: "10px", alignItems: "center" }}
                >
                  <InputSwitch
                    onChangeInput={(value) => {
                      if (value) {
                        const actualValues = values?.["billPayments"]
                          ? [...values["billPayments"], payment.id]
                          : [payment.id];
                        setFieldValue("billPayments", actualValues);
                      } else {
                        setFieldValue(
                          "billPayments",
                          values?.["billPayments"]?.filter(
                            (item) => item !== payment.id
                          )
                        );
                      }
                    }}
                    name={`activePayment${payment.id}`}
                    options={[{ label: "", value: payment.id }]}
                  />
                </div>
              );
            },
            props: {},
            allProps: true,
          },
        },
        {
          id: "id",
          label: "Cancelar",
          enabled:
            props.cancelled === true &&
            props?.cancelledStatus === "P" &&
            hasPermission,
          Component: {
            Element: (payment) => {
              return (
                <div
                  className="uk-flex"
                  style={{ gap: "10px", alignItems: "center" }}
                >
                  Novo
                </div>
              );
            },
            props: {},
            allProps: true,
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
