export type LoadAllReasons = {
  loadAll: (params: LoadAllReasons.Params) => Promise<LoadAllReasons.Model>;
};

export type Reason = {
  id: string;
  reason: string;
  requires_observation: boolean;
  type: "CA" | "RA" | "REATIVAR" | "TROCA";
};

export namespace LoadAllReasons {
  export type Params = {
    type: Reason["type"];
  };

  export type Model = Reason[];
}
