import { Patient } from "../entities/patient";
import { Event, ScheduleService } from "../../schedule";
import { User } from "@/domain/use-cases/user";

export type Attendace = {
  id?: number | string;
  resume: string;
  protocol: string;
  patientId: Patient["id"];
  internalObservation: string;
  scheduleId?: Event["event"]["id"];
  scheduleServiceId: ScheduleService["id"];
  photos: File[]
} & AttendaceClinic;

export type AttendaceClinic = {
  realizedAt: Date;
  technicianId: User["user"]["id"];
}
