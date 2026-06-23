import { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import { FormHandler, Select } from "infinity-forge";

import { useScheduling } from "../../context";
import { CalendarEvent } from "../schedule-user-calendar/components";
import {
  DateToYYYYMMDD,
  combineDateAndTime,
  useLoadAllSchedulesUserWeek,
  useLoadProfessionalsSchedule,
} from "@/presentation";

import { configsWeekCalendar } from "./configs";

import * as S from "./styles";

export function WeekCalendar({
  viewCalendar,
  setViewCalendar,
}: {
  viewCalendar: "day" | "week";
  setViewCalendar: React.Dispatch<React.SetStateAction<"day" | "week">>;
}) {
  const [weekRange, setWeekRange] = useState({
    from: null,
    to: null,
    professionals: [],
  });

  const changeDate = useScheduling((state) => state.changeDate);
  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents
  );

  const professionals = useLoadProfessionalsSchedule();
  const allInitialized = useRef(false);

  useEffect(() => {
    if (professionals?.data?.length > 0 && !allInitialized.current) {
      allInitialized.current = true;
      setWeekRange((state) => ({
        ...state,
        professionals: professionals.data.map((p) => p.id),
      }));
    }
  }, [professionals?.data?.length]);

  const { data, refetchKeyWeekCalendar } = useLoadAllSchedulesUserWeek(
    DateToYYYYMMDD(weekRange?.to || new Date()) || "",
    DateToYYYYMMDD(weekRange?.from || new Date()) || "",
    weekRange.professionals,
    listCancelledEvents
  );

  const reducedEvents = data?.reduce((reducer: any, item: any) => {
    const list = item.events.reduce((r, ev) => {
      const eventsToAdd = ev.events.map((eventAdd) => ({
        ...eventAdd,
        scheduleUser: ev.user,
      }));

      return [...r, ...eventsToAdd];
    }, []);

    return [...reducer, ...list];
  }, []);

  const events = reducedEvents
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
        props: { ...event, scheduleUser: event.scheduleUser },
        end: event.end.substring(0, 16),
        start: event.start.substring(0, 16),
      };
    });

  const extractTime = (dateTime) => {
    return dateTime.split("T")[1].substring(0, 5);
  };

  const minStart =
    events &&
    events.length > 0 &&
    events.reduce((min, event) => {
      const startTime = extractTime(event.start);
      return startTime < min ? startTime : min;
    }, extractTime(events[0].start));

  const maxEnd =
    events &&
    events.length > 0 &&
    events.reduce((max, event) => {
      const endTime = extractTime(event.end);
      return endTime > max ? endTime : max;
    }, extractTime(events[0].end));

  return (
    <S.WeekCalendar>
      {professionals?.data && (
        <FormHandler
          initialData={{
            professionals: professionals.data.map((p) => p.id),
          }}
          onChangeForm={{
            callbackResult: (data) => {
              if (data.professionals && Array.isArray(data.professionals)) {
                setWeekRange((state) => ({
                  ...state,
                  professionals: data.professionals,
                }));
              }
            },
          }}
        >
          <Select
            isMultiple
            name="professionals"
            options={professionals.data.map((professional) => ({
              label: professional.name,
              value: professional.id,
            }))}
          />
        </FormHandler>
      )}

      {weekRange.professionals.length > 0 ? (
        <FullCalendar
          {...configsWeekCalendar}
          expandRows={true}
          eventMinHeight={50}
          dateClick={({ date }) => {
            changeDate(date);

            setViewCalendar("day");
          }}
          dayHeaderDidMount={function (arg) {
            arg.el.addEventListener("click", function () {
              changeDate(arg.date);

              setViewCalendar("day");
            });
          }}
          slotMaxTime={typeof maxEnd === "string" ? maxEnd : "23:59"}
          slotMinTime={typeof minStart === "string" ? minStart : "00:00"}
          events={events}
          initialDate={selectedDate}
          datesSet={(arg) => {
            const to = arg.end;
            const from = arg.start;

            setWeekRange((state) => ({
              from,
              to,
              professionals: state.professionals,
            } as any));
          }}
          eventContent={(event) => (
            <CalendarEvent
              showNameScheduleUser
              viewCalendar={viewCalendar}
              refetchKeyWeekCalendar={refetchKeyWeekCalendar}
              event={event.event._def.extendedProps.props}
              scheduleUser={event.event._def.extendedProps.props.scheduleUser}
            />
          )}
        />
      ) : (
        <p>
          Por favor selecione ao menos um profissional para ver o calendário
          semanal
        </p>
      )}
    </S.WeekCalendar>
  );
}
