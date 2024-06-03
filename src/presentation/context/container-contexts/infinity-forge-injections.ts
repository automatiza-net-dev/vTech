import { TypesAutomatiza, container } from "@/container";
import {
  RemoteMenu,
  RemoteLoadUserAdmin,
  InfraInjectionContextType,
} from "infinity-forge";

export const InfinityForgeInjections: InfraInjectionContextType["InjectedRemotes"] =
  {
    menu: container.get<RemoteMenu>(TypesAutomatiza.RemoteMenuAutomatiza),
    users: {
      loadUserAdmin: container.get<RemoteLoadUserAdmin>(TypesAutomatiza.RemoteLoadUserDashboard),
    },
  };
