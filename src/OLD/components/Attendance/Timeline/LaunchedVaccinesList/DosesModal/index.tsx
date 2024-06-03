// @ts-nocheck
// Core
import React, { useState, useEffect, memo, useCallback } from "react";

// Services
import { useQueryClient } from "react-query";
import { vaccinesService } from "@/OLD/services/vaccine-service";

// Components
import { Modal, notification } from "antd";
import { Container } from "./styles";
import FormChild from "./FormChild";

// Utils
import moment from "moment";

export function DosesModal({
  visible,
  setVisible,
  patient,
  vaccine,
  modal = true,
  setActiveTab = false,
  data = false,
}) {
  const [vaccineData, setVaccineData] = useState({});
  const [calendars, setCalendars] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionState, setActionState] = useState(false);
  const [actualData, setActualData] = useState({});
  const [changes, setChanges] = useState(false);

  const queryClient = useQueryClient();

  const getPatientVaccines = useCallback(() => {
    setLoading(true);
    vaccinesService
      .showPatientVaccine(vaccine)
      .then((res) => {
        setVaccineData({
          vaccine: res?.data?.vaccine?.name,
          user: res?.data?.user?.name,
          protocolLabel: `${res.data?.protocol?.name} | ${res.data?.protocol?.doses} x ${res.data.protocol?.interval}`,
          createdAt: moment(res.data?.created_at).format("DD/MM/YYYY - HH:mm"),
          data: res.data,
        });

        setCalendars(
          res.data.calendars.map((item) => {
            return {
              id: item?.id,
              laboratory: item?.laboratory,
              batch: item?.batch,
              schedulingDate: moment(item?.scheduling_date),
              applicationDate: item?.application_date
                ? moment(item?.application_date)
                : "",
              dose: item?.dose,
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao buscar as informações de agendamento da vacina",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    vaccine &&
      modal &&
      setVaccineData({
        vaccine: vaccine.vaccine?.name,
        user: vaccine.user?.name,
        protocolLabel: `${vaccine.protocol?.name} | ${vaccine.protocol?.doses} x ${vaccine.protocol?.interval}`,
        createdAt: moment(vaccine.created_at).format("DD/MM/YYYY - HH:mm"),
        data: vaccine,
      });

    vaccine?.calendars &&
      modal &&
      setCalendars(
        vaccine.calendars.map((item, i) => {
          return {
            id: item?.id,
            laboratory: item?.laboratory,
            batch: item?.batch,
            schedulingDate: moment(item?.scheduling_date),
            applicationDate: item?.application_date
              ? moment(item?.application_date)
              : "",
            dose: item?.dose,
          };
        })
      );

    !modal && getPatientVaccines();
  }, [vaccine, modal, data]);

  const submitUpdate = (data) => {
    setLoading(true);

    const obj = {
      dose: data?.dose,
      schedulingDate: moment(data?.schedulingDate),
      applicationDate: moment(data?.applicationDate),
      batch: data?.batch,
      laboratory: data?.laboratory,
    };

    !data?.schedulingDate && delete obj.schedulingDate;
    !data?.applicationDate && delete obj.applicationDate;
    !data?.batch && delete obj.batch;
    !data?.laboratory && delete data.laboratory;

    vaccinesService
      .updateApplicationDate(data?.id, obj)
      .catch((err) => {
        return notification.error({
          message: err.message,
        });
      })
      .finally(() => {
        setChanges(true);
      });
  };

  return modal ? (
    <Modal
      visible={visible}
      setVisible={setVisible}
      title={`Aplicação da vacina - Paciente: ${patient?.name}`}
      onCancel={() => setVisible(false)}
      onOk={() => {
        if (changes) {
          queryClient.invalidateQueries(["LoadAllVaccines"]);
          setVisible(false);
          setChanges(false);
          return notification.success({
            message: "Alterações salvas com sucesso!",
          });
        } else {
          setVisible(false);
          return;
        }
      }}
      width={800}
    >
      <Container>
        <FormChild
          vaccineData={vaccineData}
          calendars={calendars}
          actionState={actionState}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          actualData={actualData}
          setActualData={setActualData}
          setActionState={setActionState}
          submitUpdate={submitUpdate}
          setCalendars={setCalendars}
          modal={modal}
        />
      </Container>
    </Modal>
  ) : (
    <FormChild
      vaccineData={vaccineData}
      calendars={calendars}
      actionState={actionState}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      actualData={actualData}
      setActualData={setActualData}
      setActionState={setActionState}
      submitUpdate={submitUpdate}
      setCalendars={setCalendars}
      modal={modal}
      setActiveTab={setActiveTab}
    />
  );
}

export default DosesModal;
