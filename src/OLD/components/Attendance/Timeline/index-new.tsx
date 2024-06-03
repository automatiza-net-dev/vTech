import { useState } from "react";

import { useHospitalizations } from "@/OLD/hooks/useHospitalizations";

import { FaFilter } from "react-icons/fa";

import { List as TutorsList } from "@/OLD/components/Tutor/List";
import LastUpdates from "./LastUpdates";
import VaccinesLauchedList from "./LaunchedVaccinesList";
import { Container } from "./styles";
// import BillAndBudget from "./BillAndBudget";
// import HospitalizationTimeline from "../../Hospitalization/HospitalizationTimeline";
import { Tab, Error } from "infinity-forge";

import { Select, Tag } from "antd";
import PatientHistoric from "./Historic";
const { Option } = Select;

export default  function Timeline({ patient }) {
  const [filter, setFilter] = useState<any>("all");
  const [reload, setReload] = useState(false);
  const { hospitalizations } = useHospitalizations();


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

  const tabs = [
    {
      title: "Lançamentos",
      content: (
        <>
          <Select
            mode="multiple"
            suffixIcon={<FaFilter />}
            bordered={false}
            placeholder="Selecione"
            onChange={(val: any) => {
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
          <LastUpdates
            patient={patient}
            reload={reload}
            setReload={setReload}
            setActiveTab={"1"}
            filter={filter}
          />
        </>
      ),
      key: "lastUpdates",
    },
    process.env.client !== "liftone" && {
      title: "Tutores",
      content: (
        <TutorsList
          filters={{ patientId: patient?.id } as any}
          tutors={patient?.tutors}
          patient={patient}
          setPatientReload={setReload as any}
          reload={reload}
        />
      ),
      key: "tutors",
    },
    process.env.client !== "liftone" && {
      title: "Vacinas lançadas",
      content: (
        <VaccinesLauchedList
          reload={reload}
          setReload={setReload}
          patient={patient}
        />
      ),
      key: "launchedVaccines",
    },
    {
      title: "Vendas",
      content: (
        <></>
        // <BillAndBudget
        //   patient={patient}
        //   setReload={setReload}
        //   reloadExtern={reloadExtern}
        // />
      ),
      key: "billsAndBudgets",
    },
    process.env.client !== "liftone" && {
      title: "Registros de internação",
      content: (
        <></>
        // <HospitalizationTimeline
        //   patientData={{ ...findPatient, patient }}
        //   modal={false}
        // />
      ),
      key: "hospitalizationNotes",
    },
    {
      title: "Histórico da agenda",
      content: <PatientHistoric id={patient?.id} />,
      key: "scheduleHistoric",
    },
  ];

  return (
    <Error name="Tabs">
      <Container>
        <Tab tabs={tabs as any} />
      </Container>
    </Error>
  );
}

