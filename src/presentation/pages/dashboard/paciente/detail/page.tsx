import { Tab, TabItem } from "infinity-forge";

import {
  LastUpdates,
  TutorsTable,
  ProfileInfos,
  VaccinesTable,
  ActionsPatient,
} from "./components";
import { useLoadPatient } from "@/presentation";

import { PatientHistoric } from "@/OLD/components/Attendance/Timeline/Historic";
import { BillAndBudget } from "@/OLD/components/Attendance/Timeline/BillAndBudget";
import { HospitalizationTimeline } from "@/OLD/components/Hospitalization/HospitalizationTimeline";

import * as S from "./styles";

export function PacientePage() {
  const { data, isFetching } = useLoadPatient();

  if (isFetching || !data) {
    return <>Carregando...</>;
  }

  const tabs: TabItem[] = [
    {
      title: "Últimas Atualizações",
      content: (props) => <LastUpdates {...data} {...props} />,
      key: "ultimas_atualizacoes",
      active: true,
    },
    {
      title: "Tutores",
      content:(props) => <TutorsTable {...data} {...props}/>,
      key: "tutors",
      active: process.env.clientName === "Sanclá",
    },
    {
      title: "Vacinas / Vermífugos lançados",
      content: (props) => <VaccinesTable {...data}  {...props}/>,
      key: "vaccines",
      active: process.env.clientName === "Sanclá",
    },
    {
      title: "Vendas",
      content: (props) => <BillAndBudget patient={data} {...props}/>,
      key: "bills",
      active: true,
    },
    {
      title: "Registros de internação",
      content: (props) => <HospitalizationTimeline patientData={data} modal={false} {...props}/>,
      key: "hospitalization",
      active: process.env.clientName === "Sanclá",
    },
    {
      title: "Histórico agenda",
      content: (props) => <PatientHistoric id={data?.id} {...props}/>,
      key: "schedule",
      active: true,
    },
  ].filter((item) => item.active);

  return (
      <S.Paciente>
        <ProfileInfos patient={data} />

        <ActionsPatient />

        <Tab tabs={tabs} />
      </S.Paciente>
  );
}
