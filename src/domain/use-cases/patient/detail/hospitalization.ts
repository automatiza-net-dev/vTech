import { Tutor } from "../tutor";
import { Bed } from "./load-beds";
import { Patient } from "./entities/patient";

export type CreateHospitalization = {
  createHospitalization: (params: CreateHospitalization.Params) => Promise<{}>;
};

export namespace CreateHospitalization {
  export type Params = {
    bedId: Bed["id"];
    tutorId: Tutor["id"];
    patientId: Patient["id"];
    complaint: string;
    diagnosis: string;
    prognosis: string;
    expectedDischarge:string;
    risk: 1 | 2 | 3 | 4;
    type: 1 | 2 | 3 | 4;
  };
}
