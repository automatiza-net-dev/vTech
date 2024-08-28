import { VaccineProtocol } from "@/domain";

export type LoadVaccineProtocols = {
  loadAllProtocols: (params: LoadVaccineProtocols.Params) => Promise<LoadVaccineProtocols.Model>;
};

export namespace LoadVaccineProtocols {
  export type Params = {
    type?: string;
    vaccine?: string;
    name?: string;
    specie?: string;
  };

  export type Model = VaccineProtocol[];
}
