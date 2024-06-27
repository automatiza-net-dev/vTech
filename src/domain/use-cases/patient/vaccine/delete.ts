export type DeleteVaccine = {
  deleteVaccine: (params: DeleteVaccine.Params) => Promise<void>;
};

export namespace DeleteVaccine {
  export type Params = {
    id: string;
  };
}
