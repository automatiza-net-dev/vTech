import { Container } from "inversify";

import { patientTypes } from "./types";
import { infraContainer } from "../../infra";

import {
  RemoteTutor,
  RemotePatient,
  RemoteSchedule,
  RemoteAttendances,
  RemoteChangeStatus,
  RemotePatientAnimal,
  RemoteLoadAllReasons,
  RemoteLoadAllSchedulesUser,
  RemoteLoadSchedulesPatient,
  RemoteLoadAllScheduleStatuses,
  RemoteLoadAllSchedulesUsersWeek,
  RemoteLoadProfessionalsSchedule,
  RemoteLoadAllScheduleServicesGroups,
  RemoteLoadReturnablesSchedulePatient,
} from "@/data";

const patientContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

patientContainer.parent = infraContainer;

patientContainer.bind(patientTypes.RemoteTutor).to(RemoteTutor);
patientContainer.bind(patientTypes.RemotePatient).to(RemotePatient);
patientContainer.bind(patientTypes.RemoteSchedule).to(RemoteSchedule);
patientContainer.bind(patientTypes.RemoteAttendances).to(RemoteAttendances);
patientContainer.bind(patientTypes.RemoteChangeStatus).to(RemoteChangeStatus);
patientContainer.bind(patientTypes.RemotePatientAnimal).to(RemotePatientAnimal);
patientContainer.bind(patientTypes.RemoteLoadAllReasons).to(RemoteLoadAllReasons);
patientContainer.bind(patientTypes.RemoteLoadAllSchedulesUser).to(RemoteLoadAllSchedulesUser);
patientContainer.bind(patientTypes.RemoteLoadSchedulesPatient).to(RemoteLoadSchedulesPatient);
patientContainer.bind(patientTypes.RemoteLoadAllScheduleStatuses).to(RemoteLoadAllScheduleStatuses);
patientContainer.bind(patientTypes.RemoteLoadAllSchedulesUsersWeek).to(RemoteLoadAllSchedulesUsersWeek);
patientContainer.bind(patientTypes.RemoteLoadProfessionalsSchedule).to(RemoteLoadProfessionalsSchedule);
patientContainer.bind(patientTypes.RemoteLoadAllScheduleServicesGroups).to(RemoteLoadAllScheduleServicesGroups);
patientContainer.bind(patientTypes.RemoteLoadReturnablesSchedulePatient).to(RemoteLoadReturnablesSchedulePatient);

export { patientContainer };
