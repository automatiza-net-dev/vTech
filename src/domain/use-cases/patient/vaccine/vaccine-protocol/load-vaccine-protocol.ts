import { VaccineProtocol } from "@/domain";

export type LoadVaccineProtocol = {
  load: (
    params: LoadVaccineProtocol.Params
  ) => Promise<LoadVaccineProtocol.Model>;
};

export namespace LoadVaccineProtocol {
  export type Params = {
    id: string;
  };

  export type Model = VaccineProtocol;
}
