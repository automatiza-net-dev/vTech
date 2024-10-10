import { DreGroup } from "@/domain";

export type LoadAllDreGroups = {
  loadAllDreGroups: (
    params: LoadAllDreGroups.Params
  ) => Promise<LoadAllDreGroups.Model>;
};

export namespace LoadAllDreGroups {
  export type Params = {
    dreGroup?: DreGroup["id"];
    description?: DreGroup["description"];
    active?: DreGroup["active"];
  };

  export type Model = DreGroup[];
}
