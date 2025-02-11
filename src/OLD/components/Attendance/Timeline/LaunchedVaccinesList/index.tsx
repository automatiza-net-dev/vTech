// @ts-nocheck
// Core
import React, { useState, useCallback, memo, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import { Table } from "antd";
import { Container } from "./styles";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";
import DosesModal from "./DosesModal";

// Utils
import Columns from "./Columns";
import moment from "moment";
import "moment/locale/pt-br";
import { useToast } from "infinity-forge";

export default function ListVaccinesLauched({ reload, setReload, patient }) {
  const [allVaccines, setAllVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dosesModalVisible, setDosesModalVisible] = useState(false);
  const [selectedVaccineData, setSelectedVaccineData] = useState({});
  const router = useRouter();
  const patientId = router.query.subpage;

  const { createToast } = useToast();

  const getAllVaccines = useCallback(() => {
    setLoading(true);
    vaccinesService
      .listPatientVaccinesLaunched({ patientId })
      .then((res) => {
        res.data.sort((a, b) =>
          moment(b.created_at).diff(moment(a.created_at))
        );
        setAllVaccines(
          res.data.map((item) => {
            return {
              vaccine: item?.vaccine?.name,
              user: item?.user?.name,
              protocolLabel: `${item?.protocol?.name} | ${item?.protocol?.doses} x ${item?.protocol?.interval}`,
              createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
              data: item,
            };
          })
        );
      })
      .catch((err) => {
        setLoading(false);
        createToast({
          status: "error",
          message:
            "Houve um erro ao buscar os lançamentos de vacinas do paciente...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, reload]);

  useEffect(() => {
    getAllVaccines();
  }, [getAllVaccines]);

  return (
    <Container>
      <Table
        columns={Columns}
        dataSource={allVaccines}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              setSelectedVaccineData(record);
              setDosesModalVisible(true);
            },
          };
        }}
        rowClassName="table-row"
      />
      <DosesModal
        visible={dosesModalVisible}
        setVisible={setDosesModalVisible}
        reload={reload}
        patient={patient}
        setReload={setReload}
        vaccine={selectedVaccineData}
      />
    </Container>
  );
}
