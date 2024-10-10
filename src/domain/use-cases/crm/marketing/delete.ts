import { Marketing } from "./marketing";

export type DeleteMarketing = {
  delete: (params: DeleteMarketing.Params) => void;
};

export namespace DeleteMarketing {
  export type Params = {
    id: Marketing["id"];
  };

  export type Model = {};
}
