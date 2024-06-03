import { OpportunitieSchedule } from "./opportunitie-schedule";

export type LoadAllOpportunitiesSchedule = {
  loadAll: (
    params: LoadAllOpportunitiesSchedule.Params
  ) => Promise<LoadAllOpportunitiesSchedule.Model>;
};

export namespace LoadAllOpportunitiesSchedule {
  export type Params = {
    client: string;
    contact: string;
  };

  export type Model = OpportunitieSchedule[];
}
