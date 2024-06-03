import { ScheduleUser } from "@/domain";

export interface IScheduleUserCalendarProps {
  scheduleUser: ScheduleUser;
  viewCalendar: "day" | "week"
}
