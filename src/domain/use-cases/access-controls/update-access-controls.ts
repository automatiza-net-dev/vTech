import { LoadRolePermissions } from "./load-access-controls/load-role-permissions";

export type UpdateAccessControls = {
  update: (
    params: UpdateAccessControls.Params
  ) => Promise<UpdateAccessControls.Model>;
};
export namespace UpdateAccessControls {
  type LoadRolePermissionsModel = {
    roles: LoadRolePermissions.Model;
  };

  export type Params = { id: string } & LoadRolePermissionsModel;

  export type Model = {};
}
