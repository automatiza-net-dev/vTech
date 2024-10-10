export type CreateDreGroup = {
  createDreGroup: (
    params: CreateDreGroup.Params
  ) => Promise<void>;
};

export namespace CreateDreGroup {
  export type Params = {
    description: string;
    sequence: number;
    active: boolean;
  };
}
