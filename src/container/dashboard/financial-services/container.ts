import { Container } from "inversify";

import { financialServicesTypes } from "./types";
import { infraContainer } from "../../infra";

import {
  RemoteDre,
  RemoteBills,
  RemoteBudget,
  RemoteProduct,
  RemoteCommission,
  RemoteDailyMovements,
} from "@/data";

const financialServicesContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

financialServicesContainer.parent = infraContainer;

financialServicesContainer.bind(financialServicesTypes.RemoteDre).to(RemoteDre);
financialServicesContainer.bind(financialServicesTypes.RemoteBills).to(RemoteBills);
financialServicesContainer.bind(financialServicesTypes.RemoteBudget).to(RemoteBudget);
financialServicesContainer.bind(financialServicesTypes.RemoteProduct).to(RemoteProduct);
financialServicesContainer.bind(financialServicesTypes.RemoteCommission).to(RemoteCommission);
financialServicesContainer.bind(financialServicesTypes.RemoteDailyMovements).to(RemoteDailyMovements);

export { financialServicesContainer };
