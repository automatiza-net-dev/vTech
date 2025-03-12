import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

import { FormData } from "./interfaces";
import { BudgetItem } from "./budget-item";

import * as S from "./styles"

export function BudgetsList({
  hasOpenedBudget,
  tutors,
}: {
  hasOpenedBudget: boolean;
  tutors?: Tutor[];
}) {
  const { values } = useFormikContext<FormData>();

  return (
    <S.BudgetList>
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
    </S.BudgetList>
  );
}
