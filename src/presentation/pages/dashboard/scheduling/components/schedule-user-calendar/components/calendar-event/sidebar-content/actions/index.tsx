import { useEffect, useState } from "react";

import moment from "moment";
import { Error } from "infinity-forge";
import { useQueryClient } from "infinity-forge";

import { useLoadSynchedTreatmentsItems } from "@/presentation";

import { Event, ScheduleUser } from "@/domain";
import { DateToYYYYMMDD, useScheduling } from "@/presentation";

import {
  EndService,
  EditSchedule,
  DeleteSchedule,
  CancelSchedule,
  MissedSchedule,
  ConfirmSchedule,
  ReactivateSchedule,
  InformCustomerArrival,
  RescheduleAppointment,
  ChangeUpsertStatusAction,
} from "./components";
import { StartService } from "@/presentation/components/schedule/actions";

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

  useEffect(() => {
    if (!event) {
      return;
    }

    if (event.event?.serviceType.type !== "P") {
      return;
    }

    setSynchedItemsFilter({
      eventId: event.event.id,
    });
    setTreatmentItensOpen(true);
  }, [event]);

  const synchedItems = useLoadSynchedTreatmentsItems(synchedItemsFilter);

  const { refetch } = useQueryClient();
  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents,
  );

  const description = event?.event?.serviceStatus?.description;

  async function onExecuteAction(params?: any) {
    await refetch(["RemoteSchedules"]);

    params?.scheduleId &&
      (await refetch(["RemoteLoadSchedules", params.scheduleId]));

    if (viewCalendar !== "day") {
      await refetch([refetchKeyWeekCalendar || "-"]);
    } else {
      await refetch(["RemoteLoadAllSchedulesUser"], { mode: "include" });
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

            if (!item.text) {
              return <></>;
            }

            return (
              <span key={key}>
                {item?.icon}
                <span>
                  {item?.text === "Procedimentodocarlao" ? (
                    <>
                      <span
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          gap: "5px",
                        }}
                        onClick={() => {
                          setTreatmentItensOpen((prv) => !prv);
                          setSynchedItemsFilter({ eventId: event?.event?.id });
                        }}
                      >
                        {item?.text} -{" "}
                        <span className="custom-span">
                          Mostrar itens tratamento
                        </span>
                      </span>
                    </>
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{ __html: item.text || "" }}
                    />
                  )}
                </span>
              </span>
            );
          })}
        </div>

        {treatmentItensOpen && synchedItems?.data && (
          <div className="actions-infos">
            <div>
              {synchedItems?.data
                ?.flatMap((r) => r.items)
                .map((row) => (
                  <div key={row.treatmentId}>
                    <h3 style={{ fontWeight: '600' }}>{row.productDescription}</h3>
                    <ul>
                      {row.executions.map((execution) => (
                        <li key={execution.productivityItemId}>- {execution.productivityItemDescription}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}

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

                <span
                  dangerouslySetInnerHTML={{
                    __html: event?.event?.observation || "",
                  }}
                ></span>
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
              <StartService
                buttonTitle="Dar inicio ao atendimento"
                eventId={event.event.id}
                patientId={event.event.patient.id}
              />
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
