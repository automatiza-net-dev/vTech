import moment from "moment";
import FullCalendar from "@fullcalendar/react";

import { useAuthAdmin } from 'infinity-forge'

import { CalendarEvent } from "./components";
import { combineDateAndTime, useScheduling } from "@/presentation";

import { calendarConfigurations } from "./calendar-configurations";

import { IScheduleUserCalendarProps } from "./interfaces";

import * as S from "./styles";

export function ScheduleUserCalendar({
  scheduleUser,
  viewCalendar,
}: IScheduleUserCalendarProps) {
  const data = useAuthAdmin();
  const selectedDate = useScheduling((state) => state.selectedDate);
  const setModalPatients = useScheduling((state) => state.setModalPatients);

  const rangeProfessionalWorking = scheduleUser?.events?.filter(
    (ev) => ev.type === "working"
  )[0];

  const events = scheduleUser?.events
    ?.filter((ev) => ev.type !== "working")
    ?.map((event) => {
      if (event.type === "unavailable") {
        return {
          props: event,
          end: combineDateAndTime(selectedDate, event.end),

          start: combineDateAndTime(selectedDate, event.start),
        };
      }

      return {
        props: event,
        end: event.end.substring(0, 16),
        start: event.start.substring(0, 16),
      };
    });

  const intervalMinutes = data?.user?.unitConfig?.interval;
  const duration =
    intervalMinutes && moment.duration(intervalMinutes, "minutes");
  const formattedDuration =
    duration && moment.utc(duration.asMilliseconds()).format("HH:mm:ss");

  return (
    <S.ScheduleUserCalendar
      $height={
        intervalMinutes
          ? intervalMinutes === 15
            ? 25
            : intervalMinutes === 30
            ? 54
            : intervalMinutes === 60
            ? 50
            : 40
          : 40
      }
    >
      <div className="top-name">
        <h3>{scheduleUser?.name}</h3>
      </div>

      <FullCalendar
        {...calendarConfigurations}
        contentHeight={"410px"}
        slotDuration={formattedDuration || "00:15:00"}
        slotLabelInterval={formattedDuration || "00:15:00"}
        events={events}
        dateClick={({ date }) =>
          setModalPatients({ date, scheduleUser, type: "create" })
        }
        slotMaxTime={rangeProfessionalWorking?.end ?? "23:59"}
        slotMinTime={rangeProfessionalWorking?.start ?? "00:00"}
        initialDate={selectedDate}
        eventContent={(event) => (
          <CalendarEvent
            viewCalendar={viewCalendar}
            scheduleUser={scheduleUser}
            event={event.event._def.extendedProps.props}
          />
        )}
        slotLabelDidMount={function (arg) {
          arg.el.addEventListener("click", function (_) {
            const clickedTimeText = arg.text;

            const combinedDateTime = combineDateAndTime(
              selectedDate,
              clickedTimeText
            );

            setModalPatients({
              type: "create",
              scheduleUser,
              date: new Date(combinedDateTime),
            });
          });
        }}
        headerToolbar={false}
        dayHeaders={false}
        viewClassNames={"view"}
      />
    </S.ScheduleUserCalendar>
  );
}
