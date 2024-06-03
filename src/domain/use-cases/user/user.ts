import * as InfinityForge from "infinity-forge";

export type SystemUser = {
  isThirdParty?: boolean,
  cl: string[];
  unit: {
    id: string;
    unitConfig: {
      interval: number;
      allow_change_schedule_duration?: boolean;
    };
    economicGroup: { id: string };
  };
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
    profile_picture: null;
    postal_code: string;
    address: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    licensing_job: string;
    inscription: string;
    birth_date: string;
    on_duty: boolean;
    type: "user" | "controller";
  };
};


export type User = SystemUser & InfinityForge.UserAdmin;
