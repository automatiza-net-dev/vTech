import { Event, ScheduleUser } from "@/domain";

export type ActionSchedule = {
    event: Event
    scheduleUser: ScheduleUser;
    onExecuteAction: () => void;
}