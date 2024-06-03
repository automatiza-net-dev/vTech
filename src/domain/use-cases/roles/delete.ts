export type DeleteControllerRole = {
  delete: (params: DeleteControllerRole.Params) => Promise<{}>;
};

export namespace DeleteControllerRole {
  export type Params = {
    id: string;
  };
}
