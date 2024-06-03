export type CreateSchedule = {
  create: (params: CreateSchedule.Params) => Promise<CreateSchedule.Model>;
};

export namespace CreateSchedule {
  export type Params = {
    userId: string;
    endHour: string;
    holderId: string;
    patientId: string;
    startHour: string;
    majorComplaint: string;
    ignoreOverlapping: boolean;
    scheduleServiceTypeId: string;
  };

  export type Model = {
    id: string;
    schedule_service_type_type?: string;
  };
}
