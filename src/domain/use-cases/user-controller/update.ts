export type UpdateUserController = {
  update: (
    params: UpdateUserController.Params
  ) => Promise<UpdateUserController.Model>;
};

export namespace UpdateUserController {
  export type Params = {
    name: string;
    email: string;
    document: string;
    password: string;
    units: { businessUnitId: string; roleId: string };
  };

  export type Model = {}
}
