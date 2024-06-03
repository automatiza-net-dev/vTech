import { ControllerRole } from "./controller-role";

export type UpdateControllerRole = {
  update: (params: UpdateControllerRole.Params) => Promise<{}>;
};

export namespace UpdateControllerRole {
  export type Params = ControllerRole;
}
