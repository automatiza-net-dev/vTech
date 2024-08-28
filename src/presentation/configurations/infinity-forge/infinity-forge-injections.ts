import { TypesAutomatiza, container } from "@/container";
import { RemoteMenu } from "@/data";
import { RemoteLoadUserAdmin, InfraInjectionContextType } from "infinity-forge";

export const InfinityForgeInjections: InfraInjectionContextType["InjectedRemotes"] =
  {
    menu: {
      remote: container.get<RemoteMenu>(
        TypesAutomatiza.RemoteMenuAutomatiza
      ) as any,
    },
    users: {
      getRole: async () => ({ role: "user", user: null }),
      loadUserAdmin: container.get<RemoteLoadUserAdmin>(
        TypesAutomatiza.RemoteLoadUserDashboard
      ),
    },
  };
