export type LoadAllScheduleStatuses = {
  loadAll: (LoadAllScheduleStatuses: LoadAllScheduleStatuses.Params) => Promise<LoadAllScheduleStatuses.Model>;
};

export type ScheduleStatus = {
  id: string;
  color: string;
  description: string;
  economic_group_id: null;
  type:
    | "REC"
    | "AN"
    | "AC"
    | "CANC"
    | "FIN"
    | "ATR"
    | "ATEND"
    | "CIR"
    | "OBS"
    | "FAL"
    | "INT";
};

export namespace LoadAllScheduleStatuses {
  export type Params = {
    description?: string;
  };

  export type Model = ScheduleStatus[];
}
