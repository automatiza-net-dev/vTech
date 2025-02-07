import { Bill } from "@/domain";
import { RemoteBudget } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { useQueryClient } from "react-query";
import { useLoadPaymentsPreview } from "@/presentation/hooks";

import { Accordion, Button, useToast } from "infinity-forge";

import * as S from "./styles";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

export function PaymentsPreviewComponent(
  props: Bill & {
    setData: React.Dispatch<React.SetStateAction<any>>;
  }
) {
  const { createToast } = useToast();

  const queryClient = useQueryClient();
  const paymentsPreview = useLoadPaymentsPreview({
    budgetId: props?.budget?.id,
    fetch: !!props?.budget?.id,
  });

  return (
    paymentsPreview?.data &&
    paymentsPreview.data.length > 0 && (
      <S.PaymentsPreview>
        <Accordion
          title={"Pagamentos Previstos"}
          key="payments-preview-detail"
          children={
            paymentsPreview?.data &&
            paymentsPreview.data.map((payment, i) => (
              <div className="payments-list" key={i}>
                <div>
                  <div>
                    <span>{payment.descricao_forma_pagamento}&nbsp;</span>
                    <span>
                      {payment.qtd_parcelas_bloco_pgto > 1 ? "(Parcelado)" : ""}
                    </span>
                    &nbsp;
                    <span>{payment.descricao_bandeira_tef || ""}&nbsp;</span>
                    <span>{payment.tipo_operacao}</span>
                  </div>
                  &nbsp; &nbsp;
                  <div>{currencyFormatter(payment.valor_total)}</div>
                  &nbsp; &nbsp;
                  <div>{payment.qtd_parcelas_bloco_pgto}x</div>
                </div>

                {payment.status === "Aberto" && (
                  <div>
                    <Button
                      text="Excluir"
                      onClick={async () => {
                        try {
                          await container
                            .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
                            .deletePaymentPreview({
                              budgetPaymentId: payment.id_orcamento_pgto,
                              origin: "Venda",
                            });
                          queryClient.invalidateQueries(["paymentsPreview"]);
                          return createToast({
                            message: "Pagamento removido com sucesso!",
                            status: "success",
                          });
                        } catch (err) {
                          return createToast({
                            message: "Houve um erro ao remover o pagamento",
                            status: "error",
                          });
                        }
                      }}
                    />
                    <Button
                      text="Confirmar"
                      onClick={() =>
                        props.setData((prv) => ({
                          ...prv,
                          paymentMethodId: payment.id_forma_pagamento,
                          acquirerId: payment.id_adquirente_tef,
                          flagId: payment.id_badeira_tef,
                          paymentDescription: payment?.id_adquirente_tef
                            ? `${payment.descricao_bandeira_tef} CARTÃO ${payment.tipo_operacao}`
                            : payment?.descricao_forma_pagamento,
                          requiresDocument: payment.exige_documento,
                          installmentsValue: currencyFormatter(
                            payment.valor_total
                          ),
                          installmentsList: payment.installments,
                          maxInstallments: payment.installments.length,
                          installments: payment.qtd_parcelas_bloco_pgto,
                          budgetPaymentId: payment.id_orcamento_pgto,
                        }))
                      }
                    />
                  </div>
                )}
                {payment.status === "Excluido" && (
                  <div>
                    <span>
                      Excluido por {payment?.nome_usuario_exclusao} -{" "}
                      {moment(payment?.data_exclusao).format("DD/MM/YYYY")} -{" "}
                      {payment?.origem_exclusao}
                    </span>
                  </div>
                )}
                {payment.status === "Baixado" && (
                  <div>
                    <span>
                      Confirmado por {payment?.nome_usuario_confirmacao} -{" "}
                      {moment(payment?.data_confirmacao).format("DD/MM/YYYY")}
                    </span>
                  </div>
                )}
              </div>
            ))
          }
        />
      </S.PaymentsPreview>
    )
  );
}
