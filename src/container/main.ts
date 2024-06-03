import "reflect-metadata";

import { Container } from "inversify";
import { menuContainer } from "./menu";
import { infraContainer } from "./infra";
import { adminContainer } from "./admin";
import {
  crmContainer,
  entriesContainer,
  patientContainer,
  userDashboardContainer,
  dashboardContainer,
} from "./dashboard";

const container = Container.merge(
  infraContainer,
  adminContainer,
  patientContainer,
  crmContainer,
  entriesContainer,
  menuContainer,
  userDashboardContainer,
  dashboardContainer
);

export { container };
