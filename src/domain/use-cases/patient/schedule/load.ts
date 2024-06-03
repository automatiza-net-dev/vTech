export type LoadSchedule = {
  load: (params: LoadSchedule.Params) => Promise<LoadSchedule.Model>;
};

export namespace LoadSchedule {
  export type Params = {
    scheduleId: string;
  };

  export type Model = {
    id: string;
    holder: {
      id: string;
      name: string;
      tutor: {
        id: string;
        cellphone: string;
        telephone: null | string;
        patient_id: string;
      };
    };
    patient_name: null | string;
    patient_phone: null | string;
    start_hour: string;
    end_hour: string;
    age: null | number;
    major_complaint: string;
    created_at: string;
    updated_at: string;
    finished_at: null | string;
    on_duty: boolean;
    observation: null | string;
    opportunity_id: null | string;
    started_at: null | string;
    serviceType: {
      id: string;
      description: string;
    };
    contacts: any[];
    serviceStatus: {
      id: string;
      description: string;
      color: string;
    };
    patient: {
      id: string;
      name: string;
      gender: string;
    };
    reschedules: any[];
    reason: null | string;
    statusChanges: {
      id: number;
      user: {
        id: string;
        name: string;
        email: string;
      };
      observation: string;
      created_at: string; 
      updated_at: string; 
      reason: null | string;
      status: {
        id: string;
        description: string;
        color: string;
      };
    }[];
    scheduleReturn: null | any;
    scheduleOrigin: null | any;
  };
}
