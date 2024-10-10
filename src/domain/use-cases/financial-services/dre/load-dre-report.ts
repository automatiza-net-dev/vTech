import { BusinessUnit } from "../../business-units";

export type LoadDreReport = {
  loadDreReport: (params: LoadDreReport.Params) => Promise<LoadDreReport.Model>;
};

export namespace LoadDreReport {
  export type Params = {
    unit?: BusinessUnit["id"];
    competence?: Date;
  };

  export type Model = { result: string };
}
