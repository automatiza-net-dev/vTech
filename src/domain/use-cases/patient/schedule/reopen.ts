import { Event, Reason, ScheduleStatus } from "@/domain";

export type ReopenSchedule = {
  reopen: (params: ReopenSchedule.Params) => Promise<{}>;
};

export namespace ReopenSchedule {
  export type Params = {
    id: Event["event"]["id"];
    observation: string;
    reasonId: Reason["id"];
    statusId: ScheduleStatus["id"];
  };
}
