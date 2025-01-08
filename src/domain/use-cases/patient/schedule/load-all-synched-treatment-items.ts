import { ScheduleExecution, Event } from "@/domain";

export type LoadAllSynchedTreatmentItems = {
  loadSynchedTreatmentItems: (
    params: LoadSynchedTreatmentItems.Params
  ) => Promise<any>;
};

export namespace LoadSynchedTreatmentItems {
  export type Params = {
    eventId?: Event["event"]["id"] | null;
  };

  export type Model = {
    executions: ScheduleExecution;
  }[];
}
