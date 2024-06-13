import { DailyMovement } from "./daily-movement"

export type LoadAllDailyMovements = {
    loadAllDailyMovements: () => Promise<LoadAllDailyMovements.Model>
}

export namespace LoadAllDailyMovements {
    export type Params = {

    }

    export type Model = DailyMovement[]
}