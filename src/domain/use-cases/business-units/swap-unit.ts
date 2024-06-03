import { BusinessUnit } from "./business-unit";

export type SwapUnit = {
    swap: (params: SwapUnit.Params) => Promise<{}>
}

export namespace SwapUnit {
    export type Params = {
        unitId: BusinessUnit["id"]; 
    }
}