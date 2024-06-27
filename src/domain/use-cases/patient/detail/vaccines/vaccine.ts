import { Patient, SystemUser, Vaccine } from "@/domain";

export type ScheduleVaccine = {
  id: string;
  created_at: string;
  calendars: {
    id: string;
    patient_vacine_id: string;
    schedule_id: string | null;
    user_id: string;
    product_id: string | null;
    scheduling_date: string | null;
    application_date: string | null;
    dose: number;
    laboratory: string | null;
    batch: string | null;
    created_at: string;
  }[];
  protocol: {
    id: string;
    vaccine_id: string;
    specie_id: string | null;
    name: string;
    doses: number;
    interval: number;
    active: boolean;
    created_at: string;
  };
  patient: Patient;
  user: SystemUser["user"];
  schedule: string | null;
  vaccine: Vaccine;
};
