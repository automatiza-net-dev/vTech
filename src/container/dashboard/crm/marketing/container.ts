import { Container } from "inversify";

import { MarketingTypes } from "./types";
import { infraContainer } from "../../../infra";

import { RemoteMarketing } from "@/data";

const marketingContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

marketingContainer.parent = infraContainer;

marketingContainer.bind(MarketingTypes.RemoteMarketing).to(RemoteMarketing);

export { marketingContainer };
