import { Tutor } from "@/domain";
import * as InfinityForge from "infinity-forge";

export type SystemUser = {
  isThirdParty?: boolean;
  cl: string[];
  name: string;
  unit: {
    id: string;
    unitConfig: {
      interval: number;
      alter_prices?: boolean;
      requires_client_document?: boolean;
      allow_change_schedule_duration?: boolean;
    };
    system: {
      id: number;
      type: "Clinicas" | "Vet";
    };
    phone?: string;
    fantasy_name?: string;
    address?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    economicGroup: { id: string };
  };
  user: {
    tutor?: Tutor;
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
