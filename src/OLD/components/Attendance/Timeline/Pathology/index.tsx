// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { notification, Table } from "antd";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import Columns from "./Columns";

const PathologiesList = memo(function PatologiesList({ reload }) {
  const [allPathologies, setAllPathologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const getAllPathologies = useCallback(() => {
    setLoading(false);
    timelineService
      .listPatologies(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllPathologies(
          res.data.map((item) => {
            return {
              realizedAt: moment(item?.createdAt).format("DD/MM/YYYY - HH:mm"),
              pathology: item?.timeline_info?.pathology,
              user: item?.timeline_info?.technician?.name,
            };
          })
        );
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao recuperar as patologias registradas...",
        });
      })
      .finally(() => setLoading(false));
  }, [patientId, reload]);

  useEffect(() => {
    getAllPathologies();
  }, [getAllPathologies]);

  return <Table dataSource={allPathologies} columns={Columns} />;
});

export default PathologiesList;
