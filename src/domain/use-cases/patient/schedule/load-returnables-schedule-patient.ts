export type LoadReturnablesSchedulePatient = {
  load: (
    params: LoadReturnablesSchedulePatient.Params
  ) => Promise<LoadReturnablesSchedulePatient.Model>;
};

export namespace LoadReturnablesSchedulePatient {
  export type Params = {
    patientId: string;
  };

  export type Model = {
    description: string;
    id: string;
    schedule_service_type_id: string;
    start_hour: string;
  }[];
}
