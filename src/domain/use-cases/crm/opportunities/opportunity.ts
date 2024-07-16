import {
  CrmStatus,
  Race,
  Patient,
  Tutor,
  PatientAnimal,
  User,
  BusinessUnit,
  Event,
  Balance,
} from "@/domain";

export type Opportunity = {
  id: number;
  openingDate: Date;
  contactDate: Date;
  value: Number;
  description: string;
  observation: null | string;
  closingDate: null | Date;
  profitValue: null | Number;
  resultObservation: string | null;
  clientOriginItemDescription: string | null;
  balance: null | Balance["description"];
  active: boolean;
  race: {
    id: Race["id"];
  };
  gender: Patient["gender"];
  castrated?: Patient["castrated"];
  weight: Patient["weight"];
  status: CrmStatus;
  contact: Tutor;
  contactType: null;
  contactSubject: null;
  client: Patient & PatientAnimal;
  clientOrigin: null;
  user: {
    id: User["id"];
    name: User["user"]["name"];
  };
  unit: {
    id: BusinessUnit["id"];
    companyName: BusinessUnit["company_name"];
    fantasyName: BusinessUnit["fantasy_name"];
  };
  schedule: {
    id: Event["event"]["id"];
  };
  closingUser: {
    id: User["id"];
  };
  reason: null | string;
};
