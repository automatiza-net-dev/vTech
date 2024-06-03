import { Container } from "inversify";

import { CrmTypes } from "./types";
import { infraContainer } from "../../infra";

import { RemoteCRM } from "@/data";

const crmContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

crmContainer.parent = infraContainer;

crmContainer.bind(CrmTypes.RemoteCRM).to(RemoteCRM);

export { crmContainer };
