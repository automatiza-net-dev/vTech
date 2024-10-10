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
} from "./dashboard";
import { systemContainer } from "./system";
import { businessUnitsContainer } from "./business-units";
import { configurationContainer } from "./configuration";

const container = Container.merge(
  crmContainer,
  menuContainer,
  adminContainer,
  infraContainer,
  systemContainer,
  patientContainer,
  entriesContainer,
  subgroupContainer,
  dashboardContainer,
  marketingContainer,
  userDashboardContainer,
  businessUnitsContainer,
  configurationContainer,
  financialServicesContainer
);

export { container };
