import { VaccineProtocol } from "@/domain";

export type EditVaccineProtocol = {
  editProtocol: (
    params: EditVaccineProtocol.Params
  ) => Promise<EditVaccineProtocol.Model>;
};

export namespace EditVaccineProtocol {
  export type Params = {
    id?: string;
    vaccineId?: string;
    specieId?: string;
    name?: string;
    doses?: number;
    interval?: number;
    active?: boolean;
  };

  export type Model = VaccineProtocol;
}
