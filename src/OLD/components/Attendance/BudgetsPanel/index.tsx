// @ts-nocheck
import { useState } from "react";

import moment from "moment";

import { useBudgetsFromAttendance } from "@/OLD/hooks/useBudgets";
import AddBudgetItem from "@/OLD/components/Budget/Actions/AddBudgetItem";

import { Container } from "./styles";

export default function BudgetsPanel(attendanceId: any) {
  const [selectedBudget, setSelectedBudget] = useState(false);
  const [reload, setReload] = useState(false);
  const [addItemVisible, setAddItemVisible] = useState(false);

  const { budgets } = useBudgetsFromAttendance(attendanceId, reload);

  budgets.sort((a: any, b: any) =>
    moment(b.budget_date).diff(moment(a.budget_date))
  );

  return (
    <Container className="uk-text-center uk-width-1-6">
      {budgets?.length > 0 &&
        budgets?.map((budget: any) => (
          <div
            key={budget?.tag}
            className="custom-card"
            onClick={() => {
              setAddItemVisible(true);
              setSelectedBudget(budget);
            }}
          >
            <div>
              Dt Orçam.:{" "}
              {moment(budget?.budget_date, "YYYY-MM-DD[T]HH:mm:ss").format(
                "DD/MM/YYYY"
              )}
            </div>
            <div>Cód Orçam.: {budget?.tag}</div>
            <div>Status: {budget?.status}</div>
          </div>
        ))}
      <AddBudgetItem
        budget={selectedBudget as any}
        setReload={setReload as any}
        externVisible={addItemVisible}
        setExternVisible={setAddItemVisible as any}
        tableRender={false}
      />
    </Container>
  );
}
