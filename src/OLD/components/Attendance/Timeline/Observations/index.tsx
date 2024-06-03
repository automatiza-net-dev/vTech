// @ts-nocheck
// Core
import React, { useCallback, useEffect, useState, memo } from "react";
import { useRouter } from "next/router";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Table, notification } from "antd";

// Utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";

// Icons
import { ArrowDownload } from "@styled-icons/fluentui-system-filled/ArrowDownload";

const ObservationList = memo(function ObservationList({ reload }) {
  const [allObservations, setAllObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const getAllObservations = useCallback(() => {
    setLoading(false);
    timelineService
      .listObservations(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllObservations(
          res.data.map((item) => {
            return {
              createdAt: moment(item?.createdAt).format("DD/MM/YYYY - HH:mm"),
              user: item?.timeline_info?.technician?.name,
              arquives: <ArrowDownload size={20} />,
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar as observações registradas...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, reload]);

  useEffect(() => {
    getAllObservations();
  }, [getAllObservations]);

  return <Table dataSource={allObservations} columns={Columns} />;
});

export default ObservationList;
