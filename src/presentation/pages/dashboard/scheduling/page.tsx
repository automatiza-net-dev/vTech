import { useState } from "react";

import { Button } from "infinity-forge";

import {
  dateToDayName,
  useScheduling,
  DateToYYYYMMDD,
  useLoadAllSchedulesUser,
  SchedulingContextProvider,
  DateToYYYYMMDDSchedule,
} from "@/presentation";

import {
  PrintTable,
  WeekCalendar,
  CalendarEvent,
  ChangeDayInCalendar,
  ScheduleUserCalendar,
  ButtonCreateSchedulling,
  SwitchToggleCancelledEvents,
} from "./components";

import * as S from "./styles";

function Scheduling() {
  const [viewCalendar, setViewCalendar] = useState<"day" | "week">("day");

  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents
  );

  const dateFormatted = DateToYYYYMMDDSchedule(selectedDate || new Date()) || "";

  const { data, isFetching } = useLoadAllSchedulesUser({
    to: dateFormatted,
    from: dateFormatted,
    lista_cancelados: listCancelledEvents,
  });

  return (
    <S.Scheduling>
      {viewCalendar === "day" && (
        <h2 className="day-title">{dateToDayName(selectedDate)}</h2>
      )}

      <div className="top">
        <div className="actions">
          {viewCalendar === "day" && <ChangeDayInCalendar />} 

          <ButtonCreateSchedulling />
        </div>

        <div className="options">
         {data && <PrintTable data={data} date={dateFormatted} />}

          <Button
            text="Diário"
            style={{ opacity: viewCalendar === "day" ? 1 : 0.6 }}
            onClick={() => setViewCalendar("day")}
          />
          <Button
            text="Semanal"
            style={{ opacity: viewCalendar === "week" ? 1 : 0.6 }}
            onClick={() => setViewCalendar("week")}
          />

        <SwitchToggleCancelledEvents data={data} /> 
        </div>
      </div>

    <div style={{ display: viewCalendar === "week" ? "block" : "none" }}>
        <WeekCalendar
          setViewCalendar={setViewCalendar}
          viewCalendar={viewCalendar}
        />
      </div>

      <div
        className="schedule_users"
        style={{ display: viewCalendar === "day" ? "flex" : "none" }}
      >
        {data?.map((scheduleUser) => {
          if (isFetching) {
            return;
          }

          if (!scheduleUser.events.find((event) => event.type === "working")) {
            if (
              scheduleUser.events.length === 1 &&
              scheduleUser.events.find((event) => event.type === "unavailable")
            ) {
              return;
            }

            if (scheduleUser.events.length === 0) {
              return;
            }

            return (
              <div
                key={scheduleUser.id + selectedDate?.toISOString()}
                className="schedule_avulse"
              >
                <div className="top-name">
                  <h3>{scheduleUser.name}</h3>
                </div>

                <div className="schedule_content">
                  {scheduleUser.events
                    .sort(
                      (a, b) =>
                        new Date(a.start).getTime() -
                        new Date(b.start).getTime()
                    )
                    .map((event) => {
                      if (event.type === "unavailable") {
                        return;
                      }

                      return (
                        <div
                          key={event.event.id + selectedDate?.toISOString()}
                          style={{ marginBottom: "10px" }}
                        >
                          <CalendarEvent
                            event={event}
                            viewCalendar={viewCalendar}
                            scheduleUser={scheduleUser}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          }

          return (
            <ScheduleUserCalendar
              key={scheduleUser?.id + selectedDate?.toISOString()}
              scheduleUser={scheduleUser}
              viewCalendar={viewCalendar}
            />
          );
        })}
      </div> 
    </S.Scheduling>
  );
}

export function SchedulingPage() {
  return (
    <SchedulingContextProvider>
      <Scheduling />
    </SchedulingContextProvider>
  );
}
