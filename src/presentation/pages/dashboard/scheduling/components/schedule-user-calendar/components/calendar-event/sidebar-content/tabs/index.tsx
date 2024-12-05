import { useState } from "react";

import { LoadAllReturnableEvents } from "@/domain";

import { useLoadAllReturnableEvents, useMe } from "@/presentation/hooks";

import moment from "moment";
import { Tab, TabItem } from "infinity-forge";

import { Event } from "@/domain";

import * as S from "./styles";

export function SidebarTabs({ event }: { event: Event }) {
  const [showInfos, setShowInfos] = useState(false);
  const [params, setParams] = useState<LoadAllReturnableEvents.Params>({});

  const returnableEvents = useLoadAllReturnableEvents(params);
  const user = useMe();

  function handleShowInfos() {
    setParams({
      scheduleId: event?.event?.id,
      businessUnitId: user?.data?.unit?.id,
    });
    setShowInfos(!showInfos);
  }

  const data = returnableEvents?.data?.events[0]?.event;

  const tabs: TabItem[] = [
    {
      key: "reagendamento",
      title: "Reagendamentos",
      content: () => (
        <div>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Reagendamentos:</h5>
              </div>

              {data?.reschedules?.map((info) => (
                <div
                  className="schedule-content font-16-regular"
                  key={info?.createdAt}
                >
                  <p>
                    Data: {moment(info?.createdAt).format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p>Motivo: {info?.reason.reason}</p>

                  {info?.observation && <p>Observação: {info?.observation}</p>}
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
        </div>
      ),
    },
    {
      key: "contatos",
      title: "Contatos",
      content: () => (
        <div>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Contatos:</h5>
              </div>

              {data?.contacts?.map((info) => (
                <div
                  className="schedule-content font-16-regular"
                  key={info?.contact_date}
                >
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
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      content: () => (
        <div>
          {showInfos && (
            <div>
              <div className="schedule-title">
                <h5>Status:</h5>
              </div>

              {data?.status_changes?.reverse()?.map((info) => (
                <div className="schedule-content font-16-regular" key={info.id}>
                  <p>
                    Data: {moment(info?.created_at).format("DD-MM-YYYY HH:mm")}
                  </p>

                  <p>Status: {info?.status}</p>
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
        </div>
      ),
    },
  ];

  return (
    <S.SidebarTabs className="tab">
      <Tab tabs={tabs} />
    </S.SidebarTabs>
  );
}
