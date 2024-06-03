export type CreateUserController = {
  create: (params: CreateUserController.Params) => Promise<{}>;
};

export namespace CreateUserController {
  export type Params = {
    name: string;
    email: string;
    document: string;
    password: string;
    units: { businessUnitId: string; roleId: string };
  };
}
