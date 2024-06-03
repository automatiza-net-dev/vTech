import { Event, ScheduleUser } from "@/domain";

export type IToolTipContentProps = Event & { timeText: string; scheduleUser: ScheduleUser }
