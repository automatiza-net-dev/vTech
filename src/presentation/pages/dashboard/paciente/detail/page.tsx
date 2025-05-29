import { Tab, TabItem } from "infinity-forge";

import {
  LastUpdates,
  TutorsTable,
  Negotiations,
  ProfileInfos,
  VaccinesTable,
  ActionsPatient,
} from "./components";
import { useLoadPatient, useConfigurationsSystem, VaccinesPanel } from "@/presentation";

import { PatientHistoric } from "@/OLD/components/Attendance/Timeline/Historic";
import { BillAndBudget } from "@/OLD/components/Attendance/Timeline/BillAndBudget";
import { HospitalizationTimeline } from "@/OLD/components/Hospitalization/HospitalizationTimeline";

import * as S from "./styles";

export function PacientePage() {
  const { data, isLoading } = useLoadPatient();

  const {type} = useConfigurationsSystem()

    const tabs: TabItem[] & { active: boolean }[] = [
    {
      title: "Últimas Atualizações",
      content: LastUpdates,
      key: "ultimas_atualizacoes",
      active: true,
    },
    {
      title: "Tutores",
      content: TutorsTable,
      key: "tutors",
      active: type === "Vet",
    },
    {
      title: "Vacinas / Vermífugos lançados",
      content: (props) => <VaccinesTable {...data} {...props} />,
      key: "vaccines",
      active: type === "Vet",
    },
    {
      title: "Vacinas / Vermífugos Status",
      content: (props) => <VaccinesPanel patientId={data?.id} />,
      key: "vaccines status",
      active: type === "Vet",
    },
    {
      title: "Vendas",
      content: (props) => <BillAndBudget patient={data} {...props} />,
      key: "bills",
      active: true,
    },
    {
      title: "Registros de internação",
      content: (props) => (
        <HospitalizationTimeline patientData={data} modal={false} {...props} />
      ),
      key: "hospitalization",
      active: type === "Vet",
    },
    {
      title: "Histórico agenda",
      content: (props) => <PatientHistoric id={data?.id} {...props} />,
      key: "schedule",
      active: true,
    },
    {
      title: "Negociações",
      content: Negotiations,
      key: "negotiations",
      active: type !== "Vet",
    },
  ].filter((item) => item.active);

  if (isLoading || !data) {
    return <>Carregando...</>;
  }

  return (
    <S.Paciente>
      <ProfileInfos patient={data} />
      
      <ActionsPatient />
      
      <Tab tabs={tabs} /> 
    </S.Paciente>
  );
}

