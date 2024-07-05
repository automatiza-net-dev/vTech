import { Container } from "inversify";

import { RemoteBusinessUnits, RemoteMeta } from "../../data/use-cases/business-units";


import { businessUnitsTypes } from "./types";
import { infraContainer } from "../infra";

const businessUnitsContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

businessUnitsContainer.parent = infraContainer;

businessUnitsContainer.bind(businessUnitsTypes.RemoteMeta).to(RemoteMeta);
businessUnitsContainer.bind(businessUnitsTypes.RemoteBusinessUnits).to(RemoteBusinessUnits);

export { businessUnitsContainer };
