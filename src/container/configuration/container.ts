import { Container } from "inversify";
import { RemoteConfiguration } from "@/data";

import { configurationTypes } from "./types";
import { infraContainer } from "../infra";

const configurationContainer = new Container({ defaultScope: "Singleton", autoBindInjectable: true });

configurationContainer.parent = infraContainer
configurationContainer.bind(configurationTypes.RemoteConfiguration).to(RemoteConfiguration);

export { configurationContainer };