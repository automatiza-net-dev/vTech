// @ts-nocheck
import * as React from "react";
import styled from "styled-components";

import AddBudgetItem from "./AddBudgetItem";
import CancelBudget from "./Cancel";
import CompleteBudget from "./Complete";
import ShowBudget from "./Show";
import { PermissionItem } from "@/presentation";

const Container = styled.div`
  display: flex;
  gap: 0.75rem;

  .icon {
    cursor: pointer;
  }
`;

const BudgetActions = React.memo(function BudgetActions({
  budget,
  setReload = false,
}) {
  return (
    <Container>
      <PermissionItem hash="ORC02">
        <AddBudgetItem budget={budget} setReload={setReload} tableRender />
      </PermissionItem>
      
      <CompleteBudget budget={budget} setReload={setReload} />
      <CancelBudget budget={budget} setReload={setReload} />
      <ShowBudget budget={budget} setReload={setReload} />
    </Container>
  );
});

export default BudgetActions;
