import { Patient, Opportunity } from "@/domain";

export type CreateOpportunitiePatient = {
  createOpportunitiePatient: (
    params: CreateOpportunitiePatient.Params
  ) => Promise<{}>;
};

export namespace CreateOpportunitiePatient {
  export type Params = {
    patientId: Patient["id"];
    opportunityId: Opportunity["id"];
  };
}
