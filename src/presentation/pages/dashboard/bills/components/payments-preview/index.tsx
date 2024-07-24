import { Bill } from "@/domain";

import { useLoadPaymentsPreview } from "@/presentation/hooks";

import { Accordion, Button } from "infinity-forge";

import * as S from "./styles";

import { currencyFormatter } from "@/OLD/components/Budget";

export function PaymentsPreviewComponent(
  props: Bill & {
    setData: React.Dispatch<React.SetStateAction<any>>;
  }
) {
  const paymentsPreview = useLoadPaymentsPreview({
    budgetId: props?.budget?.id,
  });

  const verifyTotalPayed = () => {
    let totalPayed = 0;

    for (let i = 0; i < props?.payments?.length; i += 1) {
      totalPayed += props?.payments[i]?.total_value;
    }

    return totalPayed;
  };

  return (
    <S.PaymentsPreview>
      <Accordion
        title={"Pagamentos Previstos"}
        key="payments-preview-detail"
        closeIcon={"IconArrowTop"}
        openIcon={"IconArrowRight"}
        children={
          paymentsPreview?.data &&
          paymentsPreview.data.length > 0 &&
          paymentsPreview.data.map((payment, i) => (
            <div className="payments-list" key={i}>
              <div>
                <div>
                  <span>{payment.descricao_forma_pagamento}&nbsp;</span>
                  <span>{payment.descricao_bandeira_tef || ""}&nbsp;</span>
                  <span>{payment.descricao_adquirente_tef || ""}&nbsp;</span>
                </div>
                &nbsp;<div>{currencyFormatter(payment.valor_total)}</div>
                &nbsp;
                <div>{payment.qtd_parcelas_bloco_pgto}</div>
              </div>
              <Button
                text="Confirmar"
                onClick={() =>
                  props.setData((prv) => ({
                    ...prv,
                    paymentMethodId: payment.id_forma_pagamento,
                    acquirerId: payment.id_adquirente_tef,
                    flagId: payment.id_badeira_tef,
                    paymentDescription: `${payment.descricao_bandeira_tef} CARTÃO ${payment.tipo_operacao}`,
                    requiresDocument: payment.exige_documento,
                    installmentsValue: currencyFormatter(payment.valor_total),
                    installmentsList: payment.installments,
                    maxInstallments: payment.installments.length,
                    installments: payment.qtd_parcelas_bloco_pgto,
                  }))
                }
              />
            </div>
          ))
        }
      />
    </S.PaymentsPreview>
  );
}
