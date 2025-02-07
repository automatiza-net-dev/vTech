// @ts-nocheck
// Core
import React, { memo, useCallback, useEffect, useState } from "react";

// Services
import { patientExamsService } from "@/OLD/services/patientExam.service";

// Components
import { Table, notification } from "antd";
import { Container } from "./styles";
import { AddExam } from "@/OLD/components/Attendance/Forms";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import Columns from "./Columns";

// Icons
import { BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useToast } from "infinity-forge";

const ListPatientExams = memo(function ListPatientExams({
  reload,
  setReload,
  patient,
}) {
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [examPatientData, setExamPatientData] = useState({});
  // const [arquivesVisible, setArquivesVisible] = useState(false);
  const [arquives, setArquives] = useState([]);

  const {createToast} = useToast()

  const getAllExams = useCallback(() => {
    setLoading(true);
    patientExamsService
      .listPatientExams(patient?.id)
      .then((res) => {
        res.data.sort((a, b) =>
          moment(b.created_at).diff(moment(a.created_at))
        );
        setAllExams(
          res.data.map((item) => {
            return {
              arquivesList: item?.attachments,
              name: item?.exam?.name,
              technicianId: item?.user?.name,
              id: item?.id,
              createdAt: moment(item?.created_at).format("DD/MM/YYYY - HH:mm"),
              laboratory: item?.laboratory,
              arquives: (
                <div>
                  {item?.attachments.length > 0 ? (
                    <BsEye size={15} />
                  ) : (
                    <MdCancel size={15} />
                  )}
                </div>
              ),
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        createToast({ status: "error", message:  "Houve um problema ao recuperar os exames pendentes do paciente...",})
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, patient?.id]);

  useEffect(() => {
    getAllExams();
  }, [getAllExams]);

  return (
    <Container>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => {
              setExamPatientData(record);
              setVisible(true);
            },
          };
        }}
        className="table-row"
        columns={Columns}
        dataSource={allExams}
      />
      <AddExam
        reload={reload}
        setReload={setReload}
        patient={patient}
        visible={visible}
        setVisible={setVisible}
        examPatientData={examPatientData}
        arquives={arquives}
      />
    </Container>
  );
});

export default ListPatientExams;
