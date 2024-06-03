import { Tab } from "infinity-forge";

import {
  BillsTable,
  TutorsTable,
  ProfileInfos,
  VaccinesTable,
  ActionsPatient,
} from "./components";
import { useLoadPatient, LayoutDashboard } from "@/presentation";
import { PatientHistoric } from "@/OLD/components/Attendance/Timeline/Historic";
import { BillAndBudget } from "@/OLD/components/Attendance/Timeline/BillAndBudget";
import { HospitalizationTimeline } from "@/OLD/components/Hospitalization/HospitalizationTimeline";

import * as S from "./styles";

export function PacientePage() {
  const { data, isFetching } = useLoadPatient();

  if (isFetching || !data) {
    return <>Carregando...</>;
  }

  const tabs = [
    {
      title: "Tutores",
      content: <TutorsTable {...data} />,
      key: "tutors",
      active: data.tag,
    },
    {
      title: "Vacinas lançadas",
      content: <VaccinesTable {...data} />,
      key: "vaccines",
      active: true,
    },
    {
      title: "Vendas",
      content: <BillAndBudget patient={data} />,
      key: "bills",
      active: true,
    },
    {
      title: "Registros de internação",
      content: <HospitalizationTimeline patientData={data} modal={false} />,
      key: "hospitalization",
      active: true,
    },
    {
      title: "Histórico agenda",
      content: <PatientHistoric id={data?.id} />,
      key: "schedule",
      active: true,
    },
  ].filter((item) => item.active);

  return (
    <LayoutDashboard>
      <S.Paciente>
        <ProfileInfos patient={data} />

        <ActionsPatient />

        <Tab tabs={tabs} />
      </S.Paciente>
    </LayoutDashboard>
  );
}
