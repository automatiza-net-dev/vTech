import * as React from "react";
import styled from "styled-components";

import { useReactToPrint } from "react-to-print";

import ShowBudget from "./Show";
import CancelBudget from "./Cancel";
import CompleteBudget from "./Complete";
import PrintScreen from "../PrintScreen";
import AddBudget from "./add-budget";
import AddPaymentPreview from "./add-payment-preview";
import { budgetService } from "@/OLD/services/budgets.service";
import { Tooltip } from "infinity-forge";

const Container = styled.div`
  display: flex;
  align-items: "center" !important;
  gap: 0.75rem;

  > div {
    display: flex;
  }

  .icon {
    cursor: pointer;
  }
`;

function BudgetActions({ budget, setReload = false, mode }) {
  const [budgetComplete, setBudgetComplete] = React.useState(null);

  const componentRef = React.useRef<HTMLDivElement>(null);
  const componentRef2 = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handlePrint2 = useReactToPrint({
    contentRef: componentRef2,
  });

  return (
    <Container>
      <AddBudget budgetId={budget?.id} />

      <AddPaymentPreview budgetId={budget?.id} budgetTag={budget?.tag} mode={mode} />

      <CompleteBudget budget={budget} setReload={setReload} />

      <CancelBudget budget={budget} setReload={setReload} />

      <ShowBudget budget={budget} setReload={setReload} />

      <Tooltip
        idTooltip="add-item"
        content="Impressao Completa"
        enableHover
        trigger={
          <div
            style={{ cursor: "pointer" }}
            onClick={async () => {
              const res = await budgetService.getCompleteBudget(budget?.id);

              setBudgetComplete(res);

              setTimeout(() => {
                handlePrint2();
              }, 300);
            }}
          >
            <svg
              style={{ cursor: "pointer" }}
              id="Capa_1"
              enableBackground="new 0 0 512 512"
              height="20"
              viewBox="0 0 512 512"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="m481 124.241v-17.241c0-24.813-20.187-45-45-45h-15v-47c0-8.284-6.716-15-15-15h-300c-8.284 0-15 6.716-15 15v47h-15c-24.813 0-45 20.187-45 45v17.241c-17.977 5.901-31 22.833-31 42.759v120c0 24.813 20.187 45 45 45h46v165c0 8.284 6.716 15 15 15h300c8.284 0 15-6.716 15-15v-165h46c24.813 0 45-20.187 45-45v-120c0-19.926-13.023-36.858-31-42.759zm-60-32.241h15c8.271 0 15 6.729 15 15v15h-30zm-300-62h270v92h-270zm-60 77c0-8.271 6.729-15 15-15h15v30h-30zm330 375h-270v-210h270zm91-195c0 8.271-6.729 15-15 15h-46v-30h15c8.284 0 15-6.716 15-15s-6.716-15-15-15h-360c-8.284 0-15 6.716-15 15s6.716 15 15 15h15v30h-46c-8.271 0-15-6.729-15-15v-120c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z" />
                <path d="m156 182h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                <circle cx="437" cy="197" r="15" />
                <circle cx="377" cy="197" r="15" />
                <circle cx="317" cy="197" r="15" />
                <path d="m166 332h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
                <path d="m166 392h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
                <path d="m166 452h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
              </g>
            </svg>
          </div>
        }
      />

      <Tooltip
        idTooltip="test"
        enableHover
        content={`Impressao Simplificada `}
        trigger={
          <div
            style={{ cursor: "pointer" }}
            onMouseOver={() => {}}
            onClick={async () => {
              const res = await budgetService.getCompleteBudget(budget?.id);

              setBudgetComplete(res);

              setTimeout(() => {
                handlePrint();
              }, 300);
            }}
          >
            <svg
              id="Capa_2"
              enableBackground="new 0 0 512 512"
              height="20"
              viewBox="0 0 512 512"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="m481 124.241v-17.241c0-24.813-20.187-45-45-45h-15v-47c0-8.284-6.716-15-15-15h-300c-8.284 0-15 6.716-15 15v47h-15c-24.813 0-45 20.187-45 45v17.241c-17.977 5.901-31 22.833-31 42.759v120c0 24.813 20.187 45 45 45h46v165c0 8.284 6.716 15 15 15h300c8.284 0 15-6.716 15-15v-165h46c24.813 0 45-20.187 45-45v-120c0-19.926-13.023-36.858-31-42.759zm-60-32.241h15c8.271 0 15 6.729 15 15v15h-30zm-300-62h270v92h-270zm-60 77c0-8.271 6.729-15 15-15h15v30h-30zm330 375h-270v-210h270zm91-195c0 8.271-6.729 15-15 15h-46v-30h15c8.284 0 15-6.716 15-15s-6.716-15-15-15h-360c-8.284 0-15 6.716-15 15s6.716 15 15 15h15v30h-46c-8.271 0-15-6.729-15-15v-120c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z" />
                <path d="m156 182h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                <circle cx="437" cy="197" r="15" />
                <circle cx="377" cy="197" r="15" />
                <circle cx="317" cy="197" r="15" />
                <path d="m166 332h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
              </g>
            </svg>
          </div>
        }
      />

      <div style={{ display: "none" }}>
        <div ref={componentRef2}>
          {budgetComplete && (
            <PrintScreen
              budgetData={budgetComplete}
              printDetails={{ complete: true }}
            />
          )}
        </div>

        <div ref={componentRef}>
          {budgetComplete && (
            <PrintScreen
              budgetData={budgetComplete}
              printDetails={{ complete: false }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default BudgetActions;
