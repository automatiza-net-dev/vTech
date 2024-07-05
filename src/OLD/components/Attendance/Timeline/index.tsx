// @ts-nocheck
// Core
import * as React from "react";
import { memo, useState } from "react";

// Hooks
import { useHospitalizations } from "@/OLD/hooks/useHospitalizations";

// icons
import { FaFilter } from "react-icons/fa";

// Components
import { List as TutorsList } from "@/OLD/components/Tutor/List";
import LastUpdates from "./LastUpdates";
import VaccinesLauchedList from "./LaunchedVaccinesList";
import { Container } from "./styles";
import { BillAndBudget } from "./BillAndBudget";
import { HospitalizationTimeline } from "../../Hospitalization/HospitalizationTimeline";

import { Tabs, Select, Tag } from "antd";
import PatientHistoric from "./Historic";
const { TabPane } = Tabs;
const { Option } = Select;

function Timeline({ patient, reload, setReload, reloadExtern }) {
  const [activeTab, setActiveTab] = React.useState("1");
  const [filter, setFilter] = useState("all");
  const { hospitalizations } = useHospitalizations();

  const systemName = process.env.clientName;

  const findPatient = hospitalizations?.find(
    (hospitalization) => hospitalization?.patient?.id === patient?.id
  );

  const items = [
    {
      key: "1",
      label: "Últimas atualizações",
      value: "all",
    },
    {
      key: "4",
      label: "Atendimentos",
      value: "Consulta",
    },
    {
      key: "2",
      label: "Peso",
      value: "Peso",
    },
    {
      key: "3",
      label: "Documentos",
      value: "Documento",
    },
    {
      key: "11",
      label: "Exames",
      value: "Exames",
    },
    {
      key: "5",
      label: "Fotos e Videos",
      value: "Fotos",
    },
    {
      key: "6",
      label: "Patologias",
      value: "Patologia",
    },
    {
      key: "8",
      label: "Observações",
      value: "Observação",
    },
    {
      key: "7",
      label: "Receitas",
      value: "Formato Receita Médica",
    },
    {
      key: "9",
      label: "Vacinas",
      value: "Vacinas",
    },
    {
      key: "10",
      label: "Internação",
      value: "Hospitalização",
    },
  ];

  return (
    <Container>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane
          key="1"
          tab={
            <Select
              mode="multiple"
              suffixIcon={<FaFilter />}
              bordered={false}
              placeholder="Selecione"
              onChange={(val) => {
                if (val[val?.length - 1] === "all") {
                  return setFilter("all");
                } else {
                  setFilter(val?.filter((item) => item !== "all"));
                }
                if (val?.length === 0) {
                  setFilter(["all"]);
                }
              }}
              value={filter}
              className="custom-dropdown"
            >
              {items?.map((item) => (
                <Option key={item?.key} value={item?.value}>
                  {item?.label}
                </Option>
              ))}
            </Select>
          }
        >
          <LastUpdates
            patient={patient}
            reload={reload}
            setReload={setReload}
            setActiveTab={setActiveTab}
            filter={filter}
          />
        </TabPane>
        {process.env.client !== "liftone" && (
          <TabPane tab="Tutores" key="9">
            <TutorsList
              filters={{ patientId: patient?.id }}
              tutors={patient?.tutors}
              patient={patient}
              setPatientReload={setReload}
              reload={reload}
            />
          </TabPane>
        )}
        {process.env.client !== "liftone" && (
          <TabPane tab="Vacinas Lançadas" key="11">
            <VaccinesLauchedList
              reload={reload}
              setReload={setReload}
              patient={patient}
            />
          </TabPane>
        )}
        <TabPane tab="Vendas" key="12">
          <BillAndBudget
            patient={patient}
            setReload={setReload}
            reloadExtern={reloadExtern}
          />
        </TabPane>
        {process.env.client !== "liftone" && (
          <TabPane tab="Registros de internação" key="13">
            <HospitalizationTimeline
              patientData={{ ...findPatient, patient }}
              modal={false}
            />
          </TabPane>
        )}
        <TabPane tab="Histórico Agenda" key="14">
          <PatientHistoric id={patient?.id} />
        </TabPane>
      </Tabs>
    </Container>
  );
}

export default Timeline;
