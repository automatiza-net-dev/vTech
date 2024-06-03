import { Container } from "inversify";

import { entriesTypes } from "./types";
import { infraContainer } from "../../../infra";

import { RemoteEntries, RemoteReportsEntries } from "@/data";

const entriesContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

entriesContainer.parent = infraContainer;

entriesContainer.bind(entriesTypes.RemoteEntries).to(RemoteEntries);
entriesContainer.bind(entriesTypes.RemoteReportsEntries).to(RemoteReportsEntries);

export { entriesContainer };
