// @ts-nocheck
import { useBudgetsByType } from "@/OLD/hooks/useIndicators";

import { Container } from "./styles";

import { currencyFormatter } from "@/OLD/components/Budget";

function BudgetsTable({ filters }) {
  const { budgets } = useBudgetsByType(filters);

  return (
    <Container>
      <div className="uk-flex uk-text-center">
        <div className="top-header"></div>
        <div className="top-header gray-bg">Total</div>
        <div className="top-header">Confirmados</div>
        <div className="top-header gray-bg">Cancelados</div>
        <div className="top-header">Abertos</div>
      </div>
      <div className="uk-flex smallest-font uk-text-center">
        <div className="uk-width-1-4">Aval.</div>
        <div className="uk-flex uk-flex-around uk-width-1-4 gray-bg">
          <div className="uk-width-1-5">Qtd</div>
          <div className="uk-width-1-5">Vlr</div>
          <div className="uk-width-1-2">T. med</div>
        </div>
        <div className="uk-flex uk-flex-around uk-width-1-4">
          <div className="uk-width-1-5">Qtd</div>
          <div className="uk-width-1-5">Vlr</div>
          <div className="uk-width-1-2">T. med</div>
        </div>
        <div className="uk-flex uk-flex-around uk-width-1-4 gray-bg">
          <div className="uk-width-1-5">Qtd</div>
          <div className="uk-width-1-5">Vlr</div>
          <div className="uk-width-1-2">T. med</div>
        </div>
        <div className="uk-flex uk-flex-around uk-width-1-4">
          <div className="uk-width-1-5">Qtd</div>
          <div className="uk-width-1-5">Vlr</div>
          <div className="uk-width-1-2">T. med</div>
        </div>
      </div>
      {budgets && budgets?.map((budget) => (
        <div className="uk-flex smallest-font uk-text-center">
          <div className="uk-width-1-4">{budget?.user?.name}</div>
          <div className="uk-flex uk-flex-around uk-width-1-4 gray-bg">
            <div className="uk-width-1-5">{budget?.totalBudgets}</div>
            <div className="uk-width-1-5">{currencyFormatter(budget?.totalValue)}</div>
            <div className="uk-width-1-2">{currencyFormatter(budget?.avgValue)}</div>
          </div>
          <div className="uk-flex uk-flex-around uk-width-1-4">
            <div className="uk-width-1-5">{budget?.confirmed}</div>
            <div className="uk-width-1-5">{currencyFormatter(budget?.totalConfirmedValue)}</div>
            <div className="uk-width-1-2">{currencyFormatter(budget?.avgConfirmedValue)}</div>
          </div>
          <div className="uk-flex uk-flex-around uk-width-1-4 gray-bg">
            <div className="uk-width-1-5">{budget?.cancelled}</div>
            <div className="uk-width-1-5">{currencyFormatter(budget?.totalCancelledValue)}</div>
            <div className="uk-width-1-2">{currencyFormatter(budget?.avgCancelledValue)}</div>
          </div>
          <div className="uk-flex uk-flex-around uk-width-1-4">
            <div className="uk-width-1-5">{budget?.open}</div>
            <div className="uk-width-1-5">{currencyFormatter(budget?.totalOpenValue)}</div>
            <div className="uk-width-1-2">{currencyFormatter(budget?.avgOpenValue)}</div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default BudgetsTable;
