import { Permission } from "@/domain";

export type LoadRolePermissions = {
  load: (
    params: LoadRolePermissions.Params
  ) => Promise<LoadRolePermissions.Model>;
};

export namespace LoadRolePermissions {
  export type Params = {
    id: number;
  };

  export type RolePermission = {
    id: number;
    name: string;
    permissions: Permission[];
  };

  export type Model = RolePermission[];
}
