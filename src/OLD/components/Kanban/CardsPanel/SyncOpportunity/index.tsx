// @ts-nocheck
import { memo, useState } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useSyncableSchedules } from "@/OLD/hooks/useSchedules";

import { Popconfirm } from "antd";

import moment from "moment";
import { useToast } from "infinity-forge";

const SyncOpportunity = memo(function SyncOpportunity({
  data,
  setVisible,
  setReload,
}) {
  const [filters, setFilters] = useState({
    client: data?.client?.id || data?.contact?.id,
    contact: data?.contact?.id,
  });

  const { schedules } = useSyncableSchedules(filters);

  const {createToast} = useToast()

  const syncOpportunity = (data) => {
    opportunitiesService
      .syncSchedule(data)
      .then((res) => {
        setVisible(false);
        setReload((prv) => !prv);
        return createToast({ status: "success", message: "Agendamento vinculado com sucesso!" })
      })
      .catch((err) => {
        createToast({ status: "error", message:  "Não foi possível vincular a oportunidade com o agendamento selecionado" })
      });
  };

  return (
    <div className="uk-width-1-1">
      <div className="uk-flex">
        <div className="uk-width-1-2">Data Agenda</div>
        <div className="uk-width-1-2">Status Agenda</div>
      </div>
      {schedules.map((schedule) => (
        <div className="uk-flex uk-width-1-1">
          <Popconfirm
            title={`Deseja vincular a oportunidade ao agendamento selecionado? `}
            onConfirm={() =>
              syncOpportunity({
                scheduleId: schedule?.id,
                opportunityId: data?.id,
              })
            }
          >
            <div className="uk-width-1-2 uk-link">
              {moment(schedule?.start_hour, "YYYY-MM-DD[T]HH:mm:ss")?.format(
                "DD/MM/YYYY - HH:mm"
              )}
            </div>
          </Popconfirm>
          <div className="uk-width-1-2">{schedule?.description}</div>
        </div>
      ))}
    </div>
  );
});

export default SyncOpportunity;
