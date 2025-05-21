import { Patient } from "@/domain";

export type IFormCreatePatientProps = {
  origin?: "Cadastro" | "Crm" | "Agenda";
  isModal: boolean;
  onSuccess?: (data: any) => void;
  trigger?: any;
  patientId?: Patient["id"];
  buttonText?: string;
  initialDataForm?: {
    holders?: { id: string; main: boolean }[];
  };
};
