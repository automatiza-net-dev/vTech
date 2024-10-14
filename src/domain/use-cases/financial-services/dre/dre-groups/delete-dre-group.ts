import { DreGroup } from "@/domain";

export type DeleteDreGroup = {
  deleteDreGroup: (params: DeleteDreGroup.Params) => Promise<void>;
};

export namespace DeleteDreGroup {
  export type Params = {
    id: DreGroup["id"];
  };

  export type Model = DreGroup;
}
