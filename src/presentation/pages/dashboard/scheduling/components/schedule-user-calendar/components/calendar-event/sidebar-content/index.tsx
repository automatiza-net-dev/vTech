import { useState } from "react";

import moment from "moment";

import { TabPane, Tab, Icon } from "semantic-ui-react";

import { Actions } from "./actions";
import { UserInfos } from "./user-info";
import { Event, ScheduleUser } from "@/domain";
import { DateToDDMMYYYY, Error, useLoadSchedule } from "@/presentation";

import * as S from "./styles";

export function SideBarContent({
  event,
  timeText,
  setOpen,
  scheduleUser,
  viewCalendar,
  refetchKeyWeekCalendar,
}: {
  event: Event;
  setOpen;
  timeText: string;
  viewCalendar: "day" | "week";
  scheduleUser: ScheduleUser;
  refetchKeyWeekCalendar?: string;
}) {
  const [showInfos, setShowInfos] = useState(false);
  const date = DateToDDMMYYYY(event?.start || event?.event?.start_hour);

  const { data } = useLoadSchedule(event?.event?.id);

  const infos = {
    title: `Evento em ${date} das ${timeText}`,
    status: event?.event?.serviceStatus?.description,
  };

  function handleShowInfos() {
    setShowInfos(!showInfos);
  }

  const panes = [
    {
      menuItem: "Reagendamentos",
      render: () => (
        <TabPane attached={false}>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Reagendamentos:</h5>
              </div>

              {data?.reschedules?.map((info) => (
                <div className="schedule-content">
                  <p>
                    Data: {moment(info?.created_at).format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p>Motivo: {info?.reason.reason}</p>

                  <p>Observação: {info?.observation}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="reset-button"
            type="button"
            onClick={handleShowInfos}
          >
            {showInfos ? "Mostrar menos" : "Mostrar informaçoes"}
          </button>
        </TabPane>
      ),
    },
    {
      menuItem: "Contatos",
      render: () => (
        <TabPane attached={false}>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Contatos:</h5>
              </div>

              {data?.contacts?.map((info) => (
                <div className="schedule-content">
                  <p>
                    Data:{" "}
                    {moment(info?.contact_date).format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p>Observação: {info?.observation}</p>
                </div>
              ))}
            </div>
          )}
          <button
            className="reset-button"
            type="button"
            onClick={handleShowInfos}
          >
            {showInfos ? "Mostrar menos" : "Mostrar informaçoes"}
          </button>
        </TabPane>
      ),
    },
    {
      menuItem: "Status",
      render: () => (
        <TabPane attached={false}>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Status:</h5>
              </div>

              {data?.statusChanges?.map((info) => (
                <div className="schedule-content">
                  <p>
                    Data: {moment(info?.created_at).format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p>Status: {info?.status?.description}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="reset-button"
            type="button"
            onClick={handleShowInfos}
          >
            {showInfos ? "Mostrar menos" : "Mostrar informaçoes"}
          </button>
        </TabPane>
      ),
    },
  ];

  const isCancelled = infos.status === "Atendimento cancelado";

  return (
    <Error name="DrawerContent">
      <S.SideBarContent>
        <div className="head">
          <button
            className="reset-button close"
            type="button"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>

          <span>{infos.title}</span>
        </div>

        <div className="status">
          <span>{infos.status}</span>
        </div>

        <UserInfos event={event} setOpen={setOpen} />

        <Actions
          event={event}
          isCancelled={isCancelled}
          viewCalendar={viewCalendar}
          scheduleUser={scheduleUser}
          refetchKeyWeekCalendar={refetchKeyWeekCalendar}
        />

        <div className="tab">
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>
      </S.SideBarContent>
    </Error>
  );
}
