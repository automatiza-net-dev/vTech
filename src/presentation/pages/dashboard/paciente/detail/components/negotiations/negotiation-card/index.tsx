import {
  Button,
  FormHandler,
  LoaderCircle,
  formatNumberToCurrency,
} from "infinity-forge";

import { negotiationSchema } from "./schema";
import { useNegotiation } from "./hooks/useNegotiation";
import { NegotiationInfos, BudgetsList, Document } from "./components";

import { GerarDocumentoVenda } from "@/OLD/components/Bill/Actions/gerar-documento-venda";

import { NegotiationCardProps } from "./interfaces";

import * as S from "./styles";

export function NegotiationCard(props: NegotiationCardProps) {
  const { confirmBill, queryClient, router, createToast } = useNegotiation();

  const { id, budgets, negotiation, bills, isFetching, documents } = props;

  const open = negotiation?.id === id;

  const hasOpenedBudget = budgets.some((budget) => budget.status === "ABERTO");

  const confirmedBudget = budgets.find(
    (budget) => budget.status === "CONFIRMADO"
  );

  return (
    <S.NegotiationCard
      className={open ? "open" : ""}
      style={{ borderWidth: open ? "3px" : "1px" }}
    >
      <NegotiationInfos
        negotiation={props}
        onClick={() => props.setNegotiation(props)}
      >
        {isFetching ? (
          <LoaderCircle size={30} color="#444" />
        ) : (
          <FormHandler
            debugMode
            disableEnterKeySubmitForm
            cleanFieldsOnSubmit={false}
            schema={negotiationSchema}
            initialData={{
              budgets: budgets.map((budget) => {
                return { ...budget, checked: false };
              }),
            }}
            onSucess={confirmBill}
            button={
              hasOpenedBudget ? { text: "Confirmar orçamento" } : undefined
            }
          >
            <div className="budgets">
              <BudgetsList hasOpenedBudget={hasOpenedBudget} />
            </div>
          </FormHandler>
        )}

        {!hasOpenedBudget && (!documents || documents.length === 0) && (
          <GerarDocumentoVenda
            bill={bills[0]}
            client={confirmedBudget?.client}
            button={<Button type="button" text="Gerar Documentos Negociação" />}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ["openNegotiations", router?.query?.id as string],
              });

              createToast({
                message: "Documentos gerados com sucesso",
                status: "success",
              });
            }}
          />
        )}

        <div className="document_list">
          <div className="head">
            <h3>Documentos</h3>
            <h3 className="dados">Dados impressão</h3>
          </div>

          <div className="body">
            {documents &&
              documents.length > 0 &&
              documents.map((document) => (
                <Document key={document.id} {...document} />
              ))}
          </div>
        </div>
      </NegotiationInfos>
    </S.NegotiationCard>
  );
}
