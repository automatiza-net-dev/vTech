import { Event } from "./event";

export type ScheduleUser = {
    id: string;
    name: string;
    events: Event[];
    onDuty: boolean;
  };