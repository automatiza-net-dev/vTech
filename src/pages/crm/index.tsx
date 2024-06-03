// @ts-nocheck
import { useRouter } from "next/router";
import { useClientOrigin } from "@/OLD/hooks/useClientOrigin";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useListCrmStatus } from "@/OLD/hooks/useCrmStatus";
import { useContactTypes } from "@/OLD/hooks/useContactTypes";
import { useContactSubjects } from "@/OLD/hooks/useContactSubjects";
import { useActivitiesTypes } from "@/OLD/hooks/useActivitiesTypes";

import { LayoutDashboard } from "@/presentation";

// Opportunities
import Opportunities from "@/OLD/components/Opportunities";
import CreateOpportunity from "@/OLD/components/Opportunities/Actions/Create";
import UpdateOpportunity from "@/OLD/components/Opportunities/Actions/Update";
import OpportunitiesActivities from "@/OLD/components/OpportunitiesActivities";

// Kanban
import Kanban from "@/OLD/components/Kanban";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";

const renderOpportunities = (str, params) => {
  switch (str) {
    case "nova":
      return (
        <CreateOpportunity
          clients={params?.clients}
          colaborators={params?.colaborators}
          crmStatus={params?.crmStatus}
          contactTypes={params?.contactTypes}
          subjects={params?.subjects}
        />
      );
    case "editar":
      return <UpdateOpportunity />;
    case "oportunidades-atividades":
      return (
        <OpportunitiesActivities
          clients={params?.clients}
          colaborators={params?.colaborators}
          crmStatus={params?.crmStatus}
          contactTypes={params?.contactTypes}
          subjects={params?.subjects}
          actTypes={params?.actTypes}
        />
      );
    default:
      return <Opportunities />;
  }
};

export default function CrmPage() {
  const router = useRouter();

  const { clients } = useClientOrigin();
  const { colaborators } = useColaborators();
  const { crmStatus } = useListCrmStatus();
  const { contactTypes } = useContactTypes();
  const { subjects } = useContactSubjects();
  const { actTypes } = useActivitiesTypes();

  sortItems(colaborators, "name");
  sortItems(clients, "description");
  sortItems(crmStatus, "description");
  sortItems(contactTypes, "description");
  sortItems(subjects, "description");
  sortItems(actTypes, "description");

  return (
    <div>
      <LayoutDashboard>
        {/* Opportunities */}
        {router.query.page === "oportunidades" &&
          renderOpportunities(router.query.subpage, {
            clients,
            colaborators,
            crmStatus,
            contactTypes,
            subjects,
            actTypes,
          })}
        {/*kanban*/}
        {router.query.page === "kanban" && <Kanban />}
      </LayoutDashboard>
    </div>
  );
}
