import { Types } from "infinity-forge";

import { menuTypes } from "./menu";
import { InfraTypes } from "./infra";
import {
  CrmTypes,
  patientTypes,
  entriesTypes,
  dashboardContainer,
  userDashboardTypes,
  dashboardTypes
} from "./dashboard";
import { adminTypes } from "./admin";

export const TypesAutomatiza = {
  ...Types,
  ...CrmTypes,
  ...menuTypes,
  ...InfraTypes,
  ...adminTypes,
  ...patientTypes,
  ...entriesTypes,
  ...dashboardContainer,
  ...userDashboardTypes,
  ...dashboardTypes
};
