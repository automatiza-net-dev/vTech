import { VaccineProtocol } from "@/domain";

export type DeleteVaccineProtocol = {
  delete: (
    params: DeleteVaccineProtocol.Params
  ) => Promise<DeleteVaccineProtocol.Model>;
};

export namespace DeleteVaccineProtocol {
  export type Params = {
    id: string;
  };

  export type Model = VaccineProtocol;
}
