import { BusinessUnit } from "../business-unit"
import { Goal } from "./goal";


export type LoadGoal = {
    load: (params: LoadGoal.Params) => Promise<LoadGoal.Model>
}

export namespace LoadGoal {
    export type Params = {
        units: BusinessUnit["id"][],
        period: string;
        groups: BusinessUnit["economicGroup"]["id"][]
    }

    export type Model = Goal[]
}