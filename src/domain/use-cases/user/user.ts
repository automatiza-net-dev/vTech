import { Tutor } from "@/domain";
import * as InfinityForge from "infinity-forge";

export type SystemUser = {
  isThirdParty?: boolean;
  cl: string[];
  name: string;
  unit: {
    id: string;
    configs: {
      businessUnits: {
        reviewer?: "N" | "S" | "O";
        generate_bill_documents?: boolean;
        internal_code?: boolean;
        alter_prices?: boolean;
        requires_client_document?: boolean;
        controls_deposit?: boolean;
      };
      bills?: {
        generate_treatment_opened_bill?: boolean;
      }
      schedules: {
        syncScheduleMovements?: boolean;
        show_finances_schedules?: boolean;
        interval?: number;
        allow_change_schedule_duration?: boolean;
      };
      receipts: {
        generates_finances_on_receipts_finish?: boolean;
      }
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
