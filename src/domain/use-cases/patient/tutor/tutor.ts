import { Patient } from "../detail";

export type Tutor = {
  address: string;
  isMain: boolean;
  cellphone: string;
  civilStatus: string;
  clientOrigin: {
    id: string;
    description: string;
  };
  dependents: Patient[];
  patients: Patient[];
  diabetes: boolean;
  document: string;
  email: string;
  hypertension: boolean;
  id: string;
  inscription: string;
  name: string;
  corporateName: string;
  nationality: string;
  profession: {
    id: number;
    description: string;
    created_at: string;
  };
  tag: string;
  type: string;
  photo: string | null;
  gender: string;
  tags: string;
  birth_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  vaccine_origin: string | null;
  weight: string | null;
  weight_date: string | null;
  weight_origin: string | null;
  glycemia: string | null;
  pressure: string | null;
  first_sale: string;
  client_origin_item_description: string | null;
  tutor: {
    id: string;
    cellphone: string;
    telephone: string | null;
    email: string | null;
    document: string;
    patient_id: string;
  };
  is_main: false;
};
