export type LoadAllReasons = {
  loadAll: (params: LoadAllReasons.Params) => Promise<LoadAllReasons.Model>;
};

export type Reason = {
  id: string;
  reason: string;
  requires_observation: boolean;
  type: "CA";
};

export namespace LoadAllReasons {
  export type Params = {
    type: "CA" | "RA";
  };

  export type Model = Reason[];
}
