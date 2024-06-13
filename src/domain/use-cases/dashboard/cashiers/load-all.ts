import { CashiersResume } from "./resume";

export type LoadCashiersResume = {
  loadAll: (
    params: LoadCashiersResume.params
  ) => Promise<LoadCashiersResume.Model>;
};

export namespace LoadCashiersResume {
  export type params = {};

  export type Model = CashiersResume[];
}
