import { Container } from "inversify";

import { RemoteSystem } from "@/data";

import { systemTypes } from "./types";
import { infraContainer } from "../infra";

const systemContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

systemContainer.parent = infraContainer;
systemContainer.bind(systemTypes.RemoteSystem).to(RemoteSystem);

export { systemContainer };
