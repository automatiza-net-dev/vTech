import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { notification } from "antd";
import { CustomSection } from "./styles";
import { Vaccine } from "./Single";

import { timelineService } from "@/OLD/services/timeline.service";

import moment from "moment";
import "moment/locale/pt-br";

export default function LastUpdates({
  reload,
  patient,
  setReload,
  setActiveTab,
  filter,
}) {
  const [data, setData] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(false);

  const router = useRouter();
  const patientId = router.query.subpage;

  const getAppointmentsByTag = useCallback(() => {
    timelineService
      .listLastUpdates(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setData(
          res.data.filter((item) => {
            if (filter.includes("all")) {
              return item;
            }
            return filter.includes(item?.timeline_type?.description);
          })
        );
      })
      .catch((_err) => {
        return notification.error({
          message:
            "Houve um erro ao buscar as últimas atualizações lançadas...",
        });
      })
  }, [router.query.subpage, reload, filter]);

  useEffect(() => {
    getAppointmentsByTag();
  }, [getAppointmentsByTag]);

  return (
    <div className="uk-flex uk-flex-between">
      <section className="uk-width-1-5">
        
      </section>
      <CustomSection>
        {selectedUpdate && (
          <Vaccine
            setActiveTab={setActiveTab}
            selectedUpdate={selectedUpdate}
            reload={reload}
            setReload={setReload}
            patient={patient}
            setSelectedUpdate={setSelectedUpdate}
          />
        )}
      </CustomSection>
    </div>
  );
}
