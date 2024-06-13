import { TimeLine } from "../load-last-updates";
import { Attendace } from "./attendace";

export type UpdateAttendace = {
  update: (params: UpdateAttendace.Params) => Promise<UpdateAttendace.Model>;
};

export namespace UpdateAttendace {
  export type Params = {
    id: Attendace["id"];
    resume: Attendace["resume"];
    protocol: Attendace["protocol"];
    internalObservation: Attendace["internalObservation"];
  };

  export type Model = TimeLine;
}
