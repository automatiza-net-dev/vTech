import { ControllerRole } from "./controller-role";

export type LoadAllControllerRoles = {
  loadAll: () => Promise<LoadAllControllerRoles.Model>;
};

export namespace LoadAllControllerRoles {
  export type Model = ControllerRole[];
}
