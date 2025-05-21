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

  export type Model = LoadRolesControllerSearch.Model
}
