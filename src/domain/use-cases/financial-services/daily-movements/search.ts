import { DailyMovement } from "./daily-movement";

export type SearchDailyMovements = {
  search: (
    params: SearchDailyMovements.Params
  ) => Promise<SearchDailyMovements.Model>;
};

export namespace SearchDailyMovements {
  export type Params = {
    status: DailyMovement["status"];
  };

  export type Model = DailyMovement[];
}
