import { Attendace } from "../../patient"
import { BudgetAttendance } from "./entities"

export type LoadAllBudgetsAttendance = {
    loadAll: (params: LoadAllBudgetsAttendance.Params) => Promise<LoadAllBudgetsAttendance.Model>
}

export namespace LoadAllBudgetsAttendance {
    export type Params = {
        id: Attendace["id"],
    }

    export type Model = BudgetAttendance[]
}