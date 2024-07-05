import { Container } from "inversify";
import { infraContainer } from "infinity-forge";
import { RemoteConfiguration } from "@/data";

import { configurationTypes } from "./types";

const configurationContainer = new Container({ defaultScope: "Singleton", autoBindInjectable: true });

configurationContainer.parent = infraContainer
configurationContainer.bind(configurationTypes.RemoteConfiguration).to(RemoteConfiguration);

export { configurationContainer };