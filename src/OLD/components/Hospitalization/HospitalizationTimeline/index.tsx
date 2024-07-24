// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  useTimeline,
  useCompleteHospitalizationsTimeline,
} from "@/OLD/hooks/useTimeline";
import { Button, DatePicker, Modal, Select } from "antd";
import Timeline from "./Timeline";
import ReactToPrint from "react-to-print";
import PrintContent from "../HospitalizationTimeline/Print";

const { Option } = Select;

import moment from "moment";

const filterOptions = [
  { label: "Dados da internação", value: "begin_hospitalization", key: 1 },
  { label: "Alta da internação", value: "hospitalization_completed", key: 2 },
  { label: "Ocorrência de internação", value: "occurrence", key: 3 },
  { label: "Relatório médico", value: "report_occurrence", key: 4 },
  { label: "Prescrição médica", value: "prescription", key: 5 },
  { label: "Óbito", value: "death_occurrence", key: 6 },
  { label: "Peso", value: "weight_occurrence", key: 7 },
  { label: "Finalizar Internação", value: "scheduling_execution", key: 8 },
];

export function HospitalizationTimeline({
  visible = false,
  setVisible = false,
  modal,
  patientData,
}) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reload, setReload] = useState(false);

  const { timelineData } = useTimeline(
    patientData?.id,
    modal ? visible : false,
    reload
  );

  const { timelineData: completeTimeline } =
    useCompleteHospitalizationsTimeline(patientData?.id, !modal, reload);

  const componentRef = useRef();

  const handleFilterChange = (values) => {
    if (values.length === filterOptions.length) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(values);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const filteredTimelineData =
    selectedFilters.length === 0
      ? timelineData
      : timelineData.filter((item) =>
          selectedFilters.includes(item.meta.origin || item.meta.type)
        );

  const filteredAndDateRangeTimelineData =
    startDate && endDate
      ? filteredTimelineData.filter((item) => {
          const createdAt = new Date(item.createdAt);
          return (
            moment(startDate).startOf("day") <= createdAt &&
            createdAt <= moment(endDate).endOf("day")
          );
        })
      : filteredTimelineData;

  return modal ? (
    <div ref={componentRef}>
      <Modal
        width={1000}
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Registros de internação"
        footer={null}
      >
        <div className="uk-flex">
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            placeholder="Selecione os filtros"
            onChange={handleFilterChange}
            value={selectedFilters}
          >
            {filterOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            className="uk-margin-small-right"
            format="DD/MM/YYYY"
            style={{ marginLeft: "16px" }}
            onChange={handleDateRangeChange}
          />
          <ReactToPrint
            trigger={() => (
              <Button style={{ marginTop: "00px" }}>Imprimir</Button>
            )}
            content={() => componentRef.current}
          />
        </div>

        <Timeline
          data={filteredAndDateRangeTimelineData}
          setVisible={setVisible}
          modal={modal}
          patientData={patientData}
          setReload={setReload}
          allowEdit={!patientData?.finished_at}
        />
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <PrintContent
              obj={filteredAndDateRangeTimelineData}
              patient={patientData}
            />
          </div>
        </div>
        <footer className="uk-flex uk-flex-right">
          <Button onClick={() => setVisible(false)}>Fechar</Button>
        </footer>
      </Modal>
    </div>
  ) : (
    <Timeline
      data={completeTimeline}
      setVisible={setVisible}
      modal={modal}
      patientData={patientData}
      setReload={setReload}
      allowEdit={!patientData?.finished_at}
    />
  );
}
