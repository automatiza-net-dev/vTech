import { Event } from "./entities";

export type LoadAllSchedulesUsersWeek = {
  loadAll: (
    params: LoadAllSchedulesUsersWeek.Params
  ) => Promise<LoadAllSchedulesUsersWeek.Model>;
};

export namespace LoadAllSchedulesUsersWeek {
  export type Params = {
    from: string;
    to: string;
    users: string[];
  };

  export type Model = {
    day: string;
    events: {
      events: Event[];
      user: { id: string; name: string; onDuty: boolean };
    }[];
  }[];
}
