import { Patient } from "../patient";
import { Event, ScheduleService } from "../../schedule";

export type Attendace = {
  id?: number;
  resume: string;
  protocol: string;
  patientId: Patient["id"];
  internalObservation: string;
  scheduleId?: Event["event"]["id"];
  scheduleServiceId: ScheduleService["id"];
};
