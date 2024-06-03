import { Event } from "./entities";

export type LoadAllSchedulesDashboard = {
  loadAllSchedulesDashboard: (
    params: LoadAllSchedulesDashboard.Params
  ) => Promise<LoadAllSchedulesDashboard.Model>;
};

export namespace LoadAllSchedulesDashboard {
  export type Params = {};

  export type Model = {
    confirmed: Event[];

    nonConfirmed: Event[];
  };
}
