import { Indicator } from "./indicator";

export type LoadIndicator = {
  loadAll: (params: LoadIndicator.params) => Promise<LoadIndicator.Model>;
};

export namespace LoadIndicator {
  export type params = {
    periodo: string;
    business_unit_id: string;
  };

  export type Model = Indicator;
}
