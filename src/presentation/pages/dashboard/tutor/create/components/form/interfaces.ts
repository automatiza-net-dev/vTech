import { Dispatch, SetStateAction } from "react";

import { Patient, Tutor } from "@/domain";

export interface ICreateTutorFormProps {
  origin?: "Cadastro" | "Crm" | "Agenda";
  tutorId?: Tutor["id"];
  onSuccess?: (data: any) => void;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  addPet?: {
    onInitOpenModalAddPet?: boolean;
    onLinkPet: ({ patientId }: { patientId: Patient["id"], handleSuccess(): Promise<void>}) => void;
  }
}
