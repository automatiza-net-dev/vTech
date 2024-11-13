import { ScheduleExecution, Patient } from "@/domain";

export type LoadSyncableScheduleExecutions = {
  loadSyncableExecutions: (
    params: LoadSyncableScheduleExecutions.Params
  ) => Promise<LoadSyncableScheduleExecutions.Model>;
};

export namespace LoadSyncableScheduleExecutions {
  export type Params = {
    idPaciente?: Patient["id"];
    scheduled?: boolean;
  };

  export type Model = ScheduleExecution[];
}
