import { FinancesResume } from "./resume";

export type LoadFinancesResume = {
  loadAll: (
    params: LoadFinancesResume.params
  ) => Promise<LoadFinancesResume.Model>;
};

export namespace LoadFinancesResume {
  export type params = {};

  export type Model = FinancesResume[];
}
