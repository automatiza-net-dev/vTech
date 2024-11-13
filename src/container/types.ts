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
  financialServicesTypes,
  metasTypes,
} from "./dashboard";
import { adminTypes } from "./admin";
import { systemTypes } from "./system";
import { businessUnitsTypes } from "./business-units";
import { configurationTypes } from "./configuration";
import { inviteTypes } from "./invite";

export const TypesAutomatiza = {
  ...Types,
  ...CrmTypes,
  ...menuTypes,
  ...metasTypes,
  ...InfraTypes,
  ...adminTypes,
  ...systemTypes,
  ...patientTypes,
  ...inviteTypes,
  ...entriesTypes,
  ...subgroupTypes,
  ...dashboardTypes,
  ...userDashboardTypes,
  ...businessUnitsTypes,
  ...configurationTypes,
  ...dashboardContainer,
  ...financialServicesTypes,
};
