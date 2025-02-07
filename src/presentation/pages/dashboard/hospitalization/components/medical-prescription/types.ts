export type Prescription = {
  id: string;
  type: string;
  prescribed_at: string;
  frequency: string;
  frequency_interval: number;
  frequency_unit: string;
  frequency_quantity: number;
  frequency_quantity_unit: string;
  description: string;
  resume: string;
  dose: number;
  fluid_set: null;
  fluid_speed: null;
  supplement: null;
  active: true;
  created_at: string;
  updated_at: string;
  execution_start: string;
  observation_on_execution: null;
  volume: string;
  status: string;
  excluded_at: null;
  user: null;
  scheduling: [
    {
      id: string;
      type: string;
      frequency: string;
      scheduled_at: string;
      executed_at: null;
      prescribed_at: null;
      description: string;
      resume: string;
      status: string;
      created_at: string;
      updated_at: string;
      technician: {
        id: string;
        name: string;
        email: string;
        document: string;
        phone: string;
        profile_picture: string;
        postal_code: string;
        address: string;
        number: string;
        complement: string;
        district: string;
        city: string;
        state: string;
        remember_me_token: null;
        active: boolean;
        licensing_job: string;
        inscription: string;
        birth_date: string;
        on_duty: boolean;
        type: "user";
      };
      executionUser: {
        name: string;
      }
      prescription: {
        id: string;
        type: string;
        prescribed_at: string;
        frequency: string;
        frequency_interval: number;
        frequency_unit: string;
        frequency_quantity: number;
        frequency_quantity_unit: string;
        description: string;
        resume: string;
        dose: number;
        fluid_set: null;
        fluid_speed: null;
        supplement: null;
        active: true;
        created_at: string;
        updated_at: string;
        execution_start: string;
        observation_on_execution: null;
        volume: string;
        status: string;
        excluded_at: null;
      };
    }
  ];
};

export type Hospitalization = {
  id: string;
  type: string;
  expectedDischarge: string;
  createdAt: string;
  bed: {
    id: string;
    tag: string;
    name: string;
  };
  tutor: {
    id: string;
    name: string;
    cellphone: string;
    telephone: string;
  };
  patient: {
    id: string;
    tag: string;
    name: string;
    document: string;
    info: {
      race: string;
      specie: string;
      hair: string;
      age: number;
      weight: number;
      weightDate: string;
    };
  };
  prescriptions: Prescription[];
};
