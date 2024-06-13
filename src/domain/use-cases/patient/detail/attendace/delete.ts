import { TimeLine } from "../load-last-updates";

export type DeleteAttendace = {
  delete: (params: DeleteAttendace.Params) => Promise<DeleteAttendace.Model>;
};

export namespace DeleteAttendace {
  export type Params = {
    id: TimeLine["_id"];
  };

  export type Model = {}
}
