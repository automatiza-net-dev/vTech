export type ConfirmSchedule = {
  confirm: (params: ConfirmSchedule.Params) => Promise<ConfirmSchedule.Model>;
};

export namespace ConfirmSchedule {
  export type Params = {
    observation: string;
    contactDate: string;
    statusId: string;
    scheduleId: string;
  };

  export type Model = {
    id: string;
    patient_name: string | null;
    patient_phone: string | null;
    start_hour: string;
    end_hour: string;
    age: string | null;
    major_complaint: string;
    created_at: string;
    updated_at: string;
    finished_at: string | null;
    on_duty: boolean;
    observation: string | null;
    opportunity_id: string | null;
    started_at: string | null;
    serviceStatus: {
      id: string;
      economic_group_id: string | null;
      description: string;
      color: string;
      created_at: string;
      updated_at: string;
      type: string;
    };
  };
}
