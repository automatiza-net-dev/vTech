import { Container } from "inversify";

import { infraContainer } from "../../infra";
import { userDashboardTypes } from "./types";
import { RemoteLoadUserDashboard } from "@/data";

const userDashboardContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

userDashboardContainer.parent = infraContainer;

userDashboardContainer
  .bind(userDashboardTypes.RemoteLoadUserDashboard)
  .to(RemoteLoadUserDashboard);

export { userDashboardContainer };
