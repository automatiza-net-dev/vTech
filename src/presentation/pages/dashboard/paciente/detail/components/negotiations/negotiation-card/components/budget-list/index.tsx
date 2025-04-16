import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

import { FormData } from "./interfaces";
import { BudgetItem } from "./budget-item";

export function BudgetsList({
  hasOpenedBudget,
  tutors,
}: {
  hasOpenedBudget: boolean;
  tutors?: Tutor[];
}) {
  const { values } = useFormikContext<FormData>();

  return (
    <div className="budget-list">
      {values.budgets.map((budget, index) => {
        return (
          <BudgetItem
            budget={budget}
            index={index}
            hasOpenedBudget={hasOpenedBudget}
            tutors={tutors}
          />
        );
      })}
    </div>
  );
}
