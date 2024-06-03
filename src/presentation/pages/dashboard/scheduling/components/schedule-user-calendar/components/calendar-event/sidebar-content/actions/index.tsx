import { useQueryClient } from "react-query";
import { Error } from "infinity-forge";

import { Event, ScheduleUser } from "@/domain";
import { DateToYYYYMMDD, useScheduling } from "@/presentation";

import { EndService } from "./end-service";
import { EditSchedule } from "./edit-schedule";
import { StartService } from "./start-service";
import { CancelSchedule } from "./cancel-schedule";
import { MissedSchedule } from "./missed-schedule";
import { ConfirmSchedule } from "./confirm-schedule";
import { RescheduleAppointment } from "./reschedule-appointment";
import { InformCustomerArrival } from "./inform-customer-arrival";

import { IconComment, IconHospital } from "../icons";

import * as S from "./styles";

export function Actions({
  event,
  scheduleUser,
  viewCalendar,
  isCancelled,
  refetchKeyWeekCalendar,
}: {
  event: Event;
  isCancelled: boolean;
  viewCalendar: "day" | "week";
  scheduleUser: ScheduleUser;
  refetchKeyWeekCalendar?: string;
}) {
  const queryClient = useQueryClient();
  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents
  );

  const description = event?.event?.serviceStatus?.description;

  async function onExecuteAction() {
    await queryClient.invalidateQueries({ queryKey: "RemoteSchedules" });

    if (viewCalendar !== "day") {
      await queryClient.invalidateQueries({
        queryKey: refetchKeyWeekCalendar || "-",
      });
    } else {
      await queryClient.invalidateQueries({
        queryKey:
          "RemoteLoadAllSchedulesUser" +
          DateToYYYYMMDD(selectedDate || new Date()) +
          listCancelledEvents,
      });
    }
  }

  const infos = {
    type: {
      text: event?.event?.serviceType?.description,
      icon: <IconHospital />,
    },
    comments: {
      text: event?.event?.major_complaint,
      icon: <IconComment />,
    },
  };

  const propsActions = {
    event,
    scheduleUser,
    onExecuteAction,
  };

  return (
    <Error name="Actions">
      <S.Actions>
        <div className="actions-infos">
          {Object.keys(infos).map((key) => {
            const item = infos[key];

            return (
              <span key={key}>
                {item?.icon}

                <span>{item?.text}</span>
              </span>
            );
          })}
        </div>

        {isCancelled && (
          <div className="canceled-box">
            <strong>Dados Cancelamento:</strong>

            {event?.event?.reason?.reason && (
              <p>
                <strong>Motivo: </strong> {event?.event?.reason?.reason}
              </p>
            )}

            {event?.event?.observation && (
              <p>
                <strong>Observação: </strong>
                {event?.event?.observation}
              </p>
            )}
          </div>
        )}

        {!isCancelled && (
          <div className="buttons-box">
            {description === "Agendado (Não confirmado)" && (
              <ConfirmSchedule {...propsActions} />
            )}

            {description === "Agendado (Confirmado)" && (
              <InformCustomerArrival {...propsActions} />
            )}

            {description === "Na recepção" && (
              <StartService {...propsActions} />
            )}

            {(description !== "Atendimento finalizado" &&
              description !== "Em atendimento") && (
                <EditSchedule {...propsActions} />
              )}

            {(description === "Agendado (Confirmado)" ||
              description === "Agendado (Não confirmado)") && (
                <MissedSchedule {...propsActions} />
              )}

            {(description !== "Atendimento finalizado" &&
              description !== "Em atendimento") && (
                <CancelSchedule {...propsActions} />
              )}

            {(description !== "Atendimento finalizado" &&
              description !== "Em atendimento") && (
                <RescheduleAppointment {...propsActions} />
              )}

            {description === "Em atendimento" && (
              <EndService {...propsActions} />
            )}
          </div>
        )}
      </S.Actions>
    </Error>
  );
}
