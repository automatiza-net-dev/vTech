import { ScheduleService } from "../../schedule";
import { Patient } from "../patient";

export type OpenAttendace = {
  open: (params: OpenAttendace.Params) => Promise<OpenAttendace.Model>;
};

export namespace OpenAttendace {
  export type Params = {
    resume: string;
    protocol: string;
    patientId: Patient["id"]
    internalObservation: string;
    scheduleServiceId: ScheduleService["id"];
  };

  export type Model = {};
}
