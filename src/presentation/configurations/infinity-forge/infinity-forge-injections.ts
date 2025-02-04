import { TypesAutomatiza, container } from "@/container";
import { RemoteLoadUserDashboard } from "@/data";
import { InfraInjectionContextType } from "infinity-forge";

export const InfinityForgeInjections: InfraInjectionContextType["InjectedRemotes"] =
  {
    users: {
      getRole: async () => {
        const user = await container
          .get<RemoteLoadUserDashboard>(TypesAutomatiza.RemoteLoadUserDashboard)
          .load({ admin: false });

        const initialUserData = {
          ...user,
          avatar: user.user?.profile_picture || "",
          emailAddress: user?.user?.email || "",
          firstName: user?.user?.name || "",
          id: (user as any)?.user?.id || "",
          imagem: user.user?.profile_picture,
          isExternal: false,
          lastName: "",
        };

        return { role: initialUserData?.user?.type, user: initialUserData };
      },
      loadUserAdmin: container.get(TypesAutomatiza.RemoteLoadUserDashboard),
    },
  };
