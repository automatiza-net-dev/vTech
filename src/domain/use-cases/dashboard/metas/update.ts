export type UpdateMetas = {
  update: (params: UpdateMetas.params) => Promise<UpdateMetas.Model>;
};

export namespace UpdateMetas {
  export type params = {
    id: string;
    type: string;
    active: boolean;
    description: string;
  };

  export type Model = {};
}
