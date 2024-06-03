// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";

// Components
import { notification } from "antd";
import { Container } from "./styles";
import FormChild from "./FormChild";

// Utils
import moment from "moment";

export function DosesModal({
  modal = false,
  setModal,
  vaccine,
  TabVacinaItem,
  changeTab,
  setActiveTab = false,
  data = false,
}: any) {
  const [vaccineData, setVaccineData] = useState({});
  const [calendars, setCalendars] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionState, setActionState] = useState(false);
  const [actualData, setActualData] = useState({});
  const [changes, setChanges] = useState(false);

  const VaccineProps = vaccine || TabVacinaItem;

  const getPatientVaccines = useCallback(() => {
    setLoading(true);
    vaccinesService
      .showPatientVaccine(
        VaccineProps?.timeline_info?.patient_vaccine?.id || VaccineProps.id
      )
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
    VaccineProps &&
      modal &&
      setVaccineData({
        vaccine: VaccineProps.vaccine?.name,
        user: VaccineProps.user?.name,
        protocolLabel: `${VaccineProps.protocol?.name} | ${VaccineProps.protocol?.doses} x ${VaccineProps.protocol?.interval}`,
        createdAt: moment(VaccineProps.created_at).format("DD/MM/YYYY - HH:mm"),
        data: VaccineProps,
      });

    VaccineProps?.calendars &&
      modal &&
      setCalendars(
        VaccineProps.calendars.map((item, i) => {
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
  }, [VaccineProps, modal, data]);

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

  return (
    <Container>
      <FormChild
        loading={loading}
        changeTab={changeTab}
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
    </Container>
  );
}

export default DosesModal;
