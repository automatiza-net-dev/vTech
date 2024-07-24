import moment from "moment";
import { Bill, Payment } from "@/domain";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import * as S from "./styles";

export function PrintPaymentReceipts({
  bill,
  payements,
}: {
  bill: Bill;
  payements: Payment[];
}) {
  return (
    <S.PrintPaymentReceipts>
      <PrintHeader unit={bill?.businessUnit} />
      <section className="print-section">
        <h2>Recibo de pagamento</h2>

        <div>
          <span>
            Recebi de {bill?.client?.name}, inscrito no CPF/CNJP{" "}
            {bill?.client?.tutor?.document} os valores listados abaixo,
            referentes à venda {bill?.tag} realizada no dia{" "}
            {moment(bill?.bill_date).format("DD/MM/YYYY")}:
          </span>

          <table>
            <thead>
              <tr>
                <th>Data Vencimento</th>
                <th>Data Pagamento</th>
                <th>Valor R$</th>
                <th>Forma Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {payements.map((payment) => (
                <tr key={payment?.id}>
                  <td>
                    {moment(payment?.expiration_date).format("DD/MM/YYYY")}
                  </td>
                  <td>
                    {moment(payment?.finance?.payment_date).format(
                      "DD/MM/YYYY"
                    )}
                  </td>
                  <td>{payment?.total_value}</td>
                  <td>{payment?.finance?.paymentMethod.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="localization">
            [{bill?.businessUnit?.city}, {moment().format("DD/MM/YYYY")}]
          </div>
        </div>

        <div className="unity">
          [{bill?.businessUnit?.company_name}, {bill?.user?.name}]
        </div>
      </section>
    </S.PrintPaymentReceipts>
  );
}
