import { LoaderCircle } from "infinity-forge";

import { LoadAllBudgetsAttendance } from "@/domain";
import { useDictionary, useLoadAllBudgetAttendances } from "@/presentation";

import { BudgetItem } from "./budget-item";

import * as S from "./styles";

export function AttendanceBudgets(props: LoadAllBudgetsAttendance.Params) {
  const { getWord } = useDictionary();
  const { data, isFetching } = useLoadAllBudgetAttendances(props);

  if (!data || data.length === 0) {
    return <></>;
  }

  return (
    <S.AttendanceBudgets>
      <h3 className="font-18-bold">{getWord("Orçamentos")}</h3>

      {isFetching && <LoaderCircle size={30} color="#000" />}

      <div className="list-budgets">
        {data &&
          data.length > 0 &&
          data?.map((budget) => <BudgetItem key={budget.id} {...budget} />)}
      </div>
    </S.AttendanceBudgets>
  );
}
