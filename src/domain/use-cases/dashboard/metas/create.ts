export type CreateMetas = {
  create: (params: CreateMetas.params) => Promise<CreateMetas.Model>;
};

export namespace CreateMetas {
  export type params = {
    description: string;
    type: string;
  };

  export type Model = {};
}
