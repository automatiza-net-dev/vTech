export type WorkingDay = {
  id: string;
  end_hour: string;
  week_day: string;
  start_hour: string;
  business_unit_id: string;
  businessUnit: {
    id: string;
    company_name: string;
  };
};

export type BusinessUser = {
  active: boolean;
  address: null;
  birth_date: null;
  city: null;
  complement: null;
  district: null;
  document: null;
  email: string;
  id: string;
  inscription: null;
  licensing_job: null;
  name: string;
  number: null;
  on_duty: boolean;
  phone: null;
  postal_code: null;
  profile_picture: null;
  remember_me_token: null;
  state: null;
  type: "user" | "controller";
  workingDays: WorkingDay[]
};
