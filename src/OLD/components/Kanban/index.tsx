// @ts-nocheck
import { useState } from "react";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useContactTypes } from "@/OLD/hooks/useContactTypes";
import { useClientOrigin } from "@/OLD/hooks/useClientOrigin";
import { useContactSubjects } from "@/OLD/hooks/useContactSubjects";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useListCrmStatus } from "@/OLD/hooks/useCrmStatus";
import { useActivitiesTypes } from "@/OLD/hooks/useActivitiesTypes";

import { SchedulingContextProvider } from "@/presentation";

import Opportunities from "@/OLD/components/Opportunities";
import CardsPanel from "./CardsPanel";
import Activities from "@/OLD/components/OpportunitiesActivities/Activities";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Container } from "./styles";
import { Tabs } from "antd";
const { TabPane } = Tabs;
import { PageWrapper } from "infinity-forge";

import { sortItems } from "@/OLD/utils/sortItems";

export default function Kanban() {
  const [smallConfigs, setSmallConfigs] = useState({ currentKanbanTab: "1" });

  const { clients } = useClientOrigin();
  const { crmStatus } = useListCrmStatus();
  const { contactTypes } = useContactTypes();
  const { subjects } = useContactSubjects();
  const { colaborators } = useColaborators();
  const { actTypes } = useActivitiesTypes();

  sortItems(colaborators, "name");
  sortItems(clients, "description");
  sortItems(crmStatus, "description");
  sortItems(contactTypes, "description");
  sortItems(subjects, "description");
  sortItems(actTypes, "description");

  const showKanbanPermission = useUserHasPermission("CRM00");

  return !showKanbanPermission || showKanbanPermission === "loading" ? (
    <AccessDenied loading={showKanbanPermission} />
  ) : (
    <PageWrapper title="Crm">
      <Container>
        <SchedulingContextProvider>
          <Tabs
            defaultActiveKey="1"
            activeKey={smallConfigs?.currentKanbanTab}
            onChange={(key) => {
              setSmallConfigs({ ...smallConfigs, currentKanbanTab: key });
            }}
          >
            <TabPane key="1" tab="Crm">
              <CardsPanel
                clients={clients}
                colaborators={colaborators}
                crmStatus={crmStatus}
                contactTypes={contactTypes}
                subjects={subjects}
                actTypes={actTypes}
                currentKanbanTab={smallConfigs?.currentKanbanTab}
              />
            </TabPane>
            <TabPane key="2" tab="Oportunidades">
              <Opportunities
                title={false}
                clients={clients}
                colaborators={colaborators}
                crmStatus={crmStatus}
                contactTypes={contactTypes}
                subjects={subjects}
                actTypes={actTypes}
                currentKanbanTab={smallConfigs?.currentKanbanTab}
              />
            </TabPane>
            <TabPane key="3" tab="Atividades">
              <Activities
                colaborators={colaborators}
                actTypes={actTypes}
                currentKanbanTab={smallConfigs?.currentKanbanTab}
              />
            </TabPane>
          </Tabs>
        </SchedulingContextProvider>
      </Container>
    </PageWrapper>
  );
}
