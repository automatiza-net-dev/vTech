import { LoadDepartaments } from "./load-departaments";
import { LoadRolePermissions } from "./load-role-permissions";
import { LoadRolesControllerSearch } from "./load-roles-controller-search";

export type LoadAccessControls = {
  load: (
    params: LoadAccessControls.Params
  ) => Promise<LoadAccessControls.Model>;
};

export namespace LoadAccessControls {
  export type Params = {
    id: string;
  };

  type DepartamentModel = {
    departaments: LoadDepartaments.Model;
  };

  type RolesModel = {
    rolesPermissions: LoadRolePermissions.Model;
  }

  type RolesControllerSearchModel = {
    rolesControllerSearch: LoadRolesControllerSearch.Model
  }

  export type Model = DepartamentModel & RolesModel & RolesControllerSearchModel;
}
