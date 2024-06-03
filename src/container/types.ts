import { Types } from "infinity-forge";

import { menuTypes } from "./menu";
import { InfraTypes } from "./infra";
import { subgroupTypes } from "./subgroups";
import {
  CrmTypes,
  patientTypes,
  entriesTypes,
  dashboardContainer,
  userDashboardTypes,
  dashboardTypes,
} from "./dashboard";
import { adminTypes } from "./admin";
import { systemTypes } from "./system";

export const TypesAutomatiza = {
  ...Types,
  ...systemTypes,
  ...CrmTypes,
  ...menuTypes,
  ...InfraTypes,
  ...adminTypes,
  ...patientTypes,
  ...entriesTypes,
  ...dashboardContainer,
  ...userDashboardTypes,
  ...dashboardTypes,
  ...subgroupTypes
};
