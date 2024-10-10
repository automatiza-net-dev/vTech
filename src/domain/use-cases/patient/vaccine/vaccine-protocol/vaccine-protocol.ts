import { Specie, Vaccine } from "@/domain";

export type VaccineProtocol = {
  id?: string;
  vaccine_id?: string;
  specie_id?: string;
  name?: string;
  doses?: number;
  interval?: number;
  created_at?: string;
  updated_at?: string;
  vaccine: Vaccine;
  specie: Specie;
  active?: boolean;
  expirationDays?: string | null;
};
