import { Vaccine, BusinessUnit, Specie, VaccineProtocol } from "@/domain";

export type LoadVaccinesReports = {
  loadVaccinesReport: (
    params: LoadVaccinesReport.Params
  ) => Promise<LoadVaccinesReport.Model>;
};

export namespace LoadVaccinesReport {
  export type Params = {
    type: "vaccine" | "vermifuge";
    units?: BusinessUnit["id"][];
    fromScheduling?: string;
    toScheduling?: string;
    fromApplication?: string;
    toApplication?: string;
    specie?: Specie["id"];
    vaccine?: Vaccine["id"];
    protocol?: VaccineProtocol["id"];
    status?: string;
    order?: "Protocolo";
  };

  export type Model = Vaccine[];
}
