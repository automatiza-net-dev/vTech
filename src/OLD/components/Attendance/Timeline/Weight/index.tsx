// @ts-nocheck
// Core
import React, { useEffect, useState, memo, useCallback } from "react";
import { useRouter } from "next/router";

// Components
import { notification, Table } from "antd";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";
import { useToast } from "infinity-forge";

const ListWeight = memo(function ListWeight({ reload }) {
  const [allWeights, setAllWeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.subpage;

  const {createToast} = useToast()

  const getAllWeights = useCallback(() => {
    setLoading(true);
    timelineService
      .listWeight(patientId)
      .then((res) => {
        res.data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        setAllWeights(
          res.data.map((item) => {
            return {
              createdAt: moment(item?.timeline_info?.realizedAt).format(
                "DD/MM/YYYY - HH:mm"
              ),
              user: item?.timeline_info?.technician?.name,
              weight: item?.timeline_info?.weight,
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message: "Houve um erro ao buscar os pesos registrados..." })
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, reload]);

  useEffect(() => {
    getAllWeights();
  }, [getAllWeights]);

  return <Table dataSource={allWeights} columns={Columns} />;
});

export default ListWeight;
