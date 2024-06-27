export type CreateVaccineProtocol = {
  createVaccineProtocol: (
    params: CreateVaccineProtocol.Params
  ) => Promise<void>;
};

export namespace CreateVaccineProtocol {
  export type Params = {
    name: string;
    vaccineId: string;
    specieId: string;
    doses: number;
    interval: number;
  };

  export type Model = {};
}
