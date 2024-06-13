import { TimeLine } from "../load-last-updates";
import { Attendace } from "./attendace";


export type OpenAttendace = {
  open: (params: OpenAttendace.Params) => Promise<OpenAttendace.Model>;
};

export namespace OpenAttendace {
  export type Params = Attendace

  export type Model = TimeLine;
}
