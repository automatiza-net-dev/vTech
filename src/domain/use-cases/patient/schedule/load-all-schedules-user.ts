import { ScheduleUser } from "./entities";

export type LoadAllSchedulesUser = {
  loadAll: (
    params: LoadAllSchedulesUser.Params
  ) => Promise<LoadAllSchedulesUser.Model>;
};

export namespace LoadAllSchedulesUser {
  export type Params = {
    from: string;
    to: string;
    lista_cancelados?: boolean;
  };

  export type Model = ScheduleUser[];
}
