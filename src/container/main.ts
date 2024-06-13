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
} from "./dashboard";
import { systemContainer } from "./system";

const container = Container.merge(
  infraContainer,
  adminContainer,
  patientContainer,
  crmContainer,
  entriesContainer,
  menuContainer,
  userDashboardContainer,
  dashboardContainer,
  subgroupContainer,
  systemContainer,
  financialServicesContainer
);

export { container };
