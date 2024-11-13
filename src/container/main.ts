import "reflect-metadata";

import { Container } from "inversify";
import { menuContainer } from "./menu";
import { infraContainer } from "./infra";
import { adminContainer } from "./admin";
import { subgroupContainer } from "./subgroups";
import {
  crmContainer,
  entriesContainer,
  patientContainer,
  userDashboardContainer,
  dashboardContainer,
  financialServicesContainer,
  marketingContainer,
  metasContainer,
} from "./dashboard";
import { systemContainer } from "./system";
import { businessUnitsContainer } from "./business-units";
import { configurationContainer } from "./configuration";
import { inviteContainer } from "./invite";

const container = Container.merge(
  crmContainer,
  menuContainer,
  adminContainer,
  infraContainer,
  systemContainer,
  metasContainer,
  patientContainer,
  entriesContainer,
  subgroupContainer,
  inviteContainer,
  dashboardContainer,
  marketingContainer,
  userDashboardContainer,
  businessUnitsContainer,
  configurationContainer,
  financialServicesContainer
);

export { container };
