import { Container } from "inversify";

import { RemoteInvite } from "@/data";

import { inviteTypes } from "./types";
import { infraContainer } from "../infra";

const inviteContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

inviteContainer.parent = infraContainer;
inviteContainer.bind(inviteTypes.RemoteInvite).to(RemoteInvite);

export { inviteContainer };
