import { PaymentReceipt, BusinessUnit } from "@/domain";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import * as S from "./styles";

export function PrintPaymentReceipts(props: {
  receipts: PaymentReceipt;
  businessUnit: BusinessUnit;
}) {

  return (
    <S.PrintPaymentReceipts>
      <PrintHeader unit={props.businessUnit} />
      <section className="print-section">
        <h2>Recibo de pagamento</h2>
        <section>
          <p>
            Recebi de {props?.receipts?.client?.name}, inscrito no CPF sob o nº (CPF), a
            importancia de R$ [valor por extenso], referente ao pagamento da
            venda: [tag da venda];
          </p>
          <p className="down-section">[localidade, dia de mes de ano]</p>
          <hr />
          <p className="down-section">[nome da unidade] - [nome do usuário]</p>
        </section>
      </section>
    </S.PrintPaymentReceipts>
  );
}
