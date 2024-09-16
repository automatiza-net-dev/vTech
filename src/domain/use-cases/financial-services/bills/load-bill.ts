import { Bill } from "./entities"

export type LoadBill = {
    load: (params: LoadBill.Params) => Promise<LoadBill.Model>
}

export namespace LoadBill {
    export type Params = {
        id?: Bill["id"];
    }

    export type Model = Bill
}