// @ts-nocheck

// components
import AccessDenied from "@/OLD/components/AccessDenied";
import { Tabs } from "antd";
import Details from "./Details";
import { Absence } from "../Absence";
import { WorkingDay } from "../WorkingDay";
import AcessData from "./AcessData";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
const { TabPane } = Tabs;

export function EditColaborator() {
  const canEditAccess = useUserHasPermission("COL04");
  const canShowSchedule = useUserHasPermission("COL05");
  const canShowScheduleBlocks = useUserHasPermission("COL06");
  const editDataPermission = useUserHasPermission("COL02");

  return !editDataPermission || editDataPermission === "loading" ? (
    <AccessDenied loading={editDataPermission} />
  ) : (
    <div className="uk-padding">
      <div>
        <h2>Editar colaborador</h2>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Dados Cadastrais" key="1">
          <Details />
        </TabPane>

        {canEditAccess && (
          <TabPane tab="Dados de Acesso" key="2">
            <AcessData />
          </TabPane>
        )}

        {canShowSchedule && (
          <TabPane tab="Horário de Agenda" key="3">
            <WorkingDay edit={true} />
          </TabPane>
        )}

        {canShowScheduleBlocks && (
          <TabPane tab="Bloqueios de Agenda" key="4">
            <Absence edit={true} />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default EditColaborator;
