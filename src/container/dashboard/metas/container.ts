import { Container } from "inversify";

import { metasTypes } from "./types";
import { infraContainer } from "../../infra";

import { RemoteMetas } from "@/data";

const metasContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

metasContainer.parent = infraContainer;

metasContainer.bind(metasTypes.RemoteMetas).to(RemoteMetas);

export { metasContainer };
