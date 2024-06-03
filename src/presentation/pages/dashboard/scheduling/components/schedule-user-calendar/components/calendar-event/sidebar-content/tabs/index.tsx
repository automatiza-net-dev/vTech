import { useState } from "react";

import moment from "moment";
import { Tab, TabItem } from "infinity-forge";

import { Event } from "@/domain";
import { useLoadSchedule } from "@/presentation";

import * as S from "./styles";

export function SidebarTabs({ event }: { event: Event }) {
  const [showInfos, setShowInfos] = useState(false);

  const { data } = useLoadSchedule(event?.event?.id);

  function handleShowInfos() {
    setShowInfos(!showInfos);
  }

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
