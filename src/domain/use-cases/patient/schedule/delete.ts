import { Event } from "@/domain";

export type DeleteSchedule = {
  delete: (params: DeleteSchedule.Params) => Promise<{}>;
};

export namespace DeleteSchedule {
  export type Params = {
    id: Event["event"]["id"];
  };

  export type Model = {};
}
