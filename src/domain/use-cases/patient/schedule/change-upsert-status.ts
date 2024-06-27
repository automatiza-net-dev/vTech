import { Reason, Event, ScheduleStatus } from "@/domain";

export type ChangeUpsertStatus = {
  changeUpsert: (params: ChangeUpsertStatus.Params) => Promise<{}>;
};

export namespace ChangeUpsertStatus {
  export type Params = {
    observation?: string;
    reasonId: Reason["id"];
    statusId: ScheduleStatus["id"];
    scheduleId: Event["event"]["id"];
  };

  export type Model = {};
}
