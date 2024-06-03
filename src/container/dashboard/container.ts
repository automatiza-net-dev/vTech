import { Container } from "inversify";

import { RemoteDashboard } from "@/data";
import { infraContainer } from "@/container";

import { dashboardTypes } from "./types";

const dashboardContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

dashboardContainer.parent = infraContainer;

dashboardContainer.bind(dashboardTypes.RemoteDashboard).to(RemoteDashboard);

export { dashboardContainer };
