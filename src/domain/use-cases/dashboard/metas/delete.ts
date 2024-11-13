export type DeleteMetas = {
  delete: (params: DeleteMetas.params) => Promise<DeleteMetas.Model>;
};

export namespace DeleteMetas {
  export type params = {
    id: string;
  };

  export type Model = {};
}
