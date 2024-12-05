import { BusinessUnit, SchedulePatient, ReturnableEvent } from "@/domain";

export type LoadAllReturnableEvents = {
  loadAllReturnableEvents: (
    params: LoadAllReturnableEvents.Params
  ) => Promise<LoadAllReturnableEvents.Model>;
};

export namespace LoadAllReturnableEvents {
  export type Params = {
    scheduleId?: SchedulePatient["id"];
    businessUnitId?: BusinessUnit["id"];
  };

  export type Model = {
    events: ReturnableEvent;
  };
}
