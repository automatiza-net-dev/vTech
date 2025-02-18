import {
  useTable,
  Input,
  InputSwitch,
  formatNumberToCurrency,
  InputCheckbox,
} from "infinity-forge";

import { Bill, Payment } from "@/domain";

import moment from "moment";

export function TablePayments(props: {
  paymentsList: Payment[];
  cancelled?: boolean;
}) {
  console.log(props);

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
          enabled: !!props.cancelled,
          Component: {
            Element: (payment) => {
              return (
                <div
                  className="uk-flex"
                  style={{ gap: "10px", alignItems: "center" }}
                >
                  <InputCheckbox
                    name="billPayments"
                    options={[{ label: "", value: payment.id }]}
                  />
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
