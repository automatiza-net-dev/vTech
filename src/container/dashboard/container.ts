import { Container } from "inversify";

import {
  RemoteDashboard,
  RemoteFinancesResume,
  RemoteCashiersResume,
  RemoteIndicators,
  RemotePatient,
} from "@/data";
import { infraContainer, patientTypes } from "@/container";

import { dashboardTypes } from "./types";

const dashboardContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

dashboardContainer.parent = infraContainer;

dashboardContainer.bind(dashboardTypes.RemoteDashboard).to(RemoteDashboard);
dashboardContainer.bind(dashboardTypes.RemoteIndicators).to(RemoteIndicators);
dashboardContainer
  .bind(dashboardTypes.RemoteFinancesResume)
  .to(RemoteFinancesResume);
dashboardContainer
  .bind(dashboardTypes.RemoteCashiersResume)
  .to(RemoteCashiersResume);

export { dashboardContainer };
