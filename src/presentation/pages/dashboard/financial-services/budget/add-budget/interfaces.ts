import { Dispatch, SetStateAction } from "react";

import { Attendace, Budget, Tutor } from "@/domain";

export interface IAddBudgetProps {
  tutorsList?: Tutor[];
  budgetId?: Budget["id"];
  attendanceId?: Attendace["id"];
  setModal?: Dispatch<SetStateAction<boolean>>;
  listCreated?: (id: Budget["id"]) => void | undefined;
}
