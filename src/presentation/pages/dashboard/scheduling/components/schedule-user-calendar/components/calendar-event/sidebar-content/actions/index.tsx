import { useState } from "react";

import moment from "moment";
import { Error, useQueryClient } from "infinity-forge";

import { useLoadSynchedTreatmentsItems } from "@/presentation";

import { Event, ScheduleUser } from "@/domain";
import { DateToYYYYMMDD, useScheduling } from "@/presentation";

import {
  EndService,
  EditSchedule,
  StartService,
  DeleteSchedule,
  CancelSchedule,
  MissedSchedule,
  ConfirmSchedule,
  ReactivateSchedule,
  InformCustomerArrival,
  RescheduleAppointment,
  ChangeUpsertStatusAction,
} from "./components";

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
  const [treatmentItensOpen, setTreatmentItensOpen] = useState(false);
  const [synchedItemsFilter, setSynchedItemsFilter] = useState({});

  const synchedItems = useLoadSynchedTreatmentsItems(synchedItemsFilter);

  const refetch = useQueryClient((state) => state.refetch);
  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents
  );

  const description = event?.event?.serviceStatus?.description;

  async function onExecuteAction(params?: any) {
    await refetch("RemoteSchedules");

    params?.scheduleId &&
      (await refetch("RemoteLoadSchedules" + params.scheduleId));

    if (viewCalendar !== "day") {
      await refetch(refetchKeyWeekCalendar || "-");
    } else {
      await refetch(
        "RemoteLoadAllSchedulesUser" +
          DateToYYYYMMDD(selectedDate || new Date()) +
          listCancelledEvents
      );
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
                <span>
                  {item?.text === "Procedimento" && (
                    <>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setTreatmentItensOpen((prv) => !prv);
                          setSynchedItemsFilter({ eventId: event?.event?.id });
                        }}
                      >
                        {item?.text} - Mostrar itens tratamento
                      </span>

                      {treatmentItensOpen && synchedItems?.data && (
                        <div>
                          {synchedItems?.data?.map(({ executions }) => (
                            <span>
                              - {executions?.productDescription} -{" "}
                              {executions?.productivityItemdescription}
                              {executions?.executionDate
                                ? ` - executado em: ${moment(
                                    executions?.executionDate
                                  ).format("DD/MM/YYYY - HH:mm")}`
                                : ""}
                              {executions?.executionUserName
                                ? `por ${executions?.executionUserName}`
                                : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </span>
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

            {description !== "Atendimento finalizado" &&
              description !== "Em atendimento" && (
                <EditSchedule {...propsActions} />
              )}

            {(description === "Agendado (Confirmado)" ||
              description === "Agendado (Não confirmado)") && (
              <MissedSchedule {...propsActions} />
            )}

            {description !== "Atendimento finalizado" &&
              description !== "Em atendimento" && (
                <CancelSchedule {...propsActions} />
              )}

            {description !== "Atendimento finalizado" &&
              description !== "Em atendimento" && (
                <RescheduleAppointment {...propsActions} />
              )}

            {description === "Em atendimento" && (
              <EndService {...propsActions} />
            )}

            <ChangeUpsertStatusAction {...propsActions} />

            <DeleteSchedule {...propsActions} />
          </div>
        )}

        {isCancelled && (
          <div className="buttons-box">
            <ReactivateSchedule {...propsActions} />
          </div>
        )}
      </S.Actions>
    </Error>
  );
}
