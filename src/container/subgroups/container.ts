import { Container } from "inversify";

import { RemoteSubgroups } from "@/data";

import { subgroupTypes } from "./types";
import { infraContainer } from "../infra";

const subgroupContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

subgroupContainer.parent = infraContainer;
subgroupContainer.bind(subgroupTypes.RemoteSubgroups).to(RemoteSubgroups);

export { subgroupContainer };
