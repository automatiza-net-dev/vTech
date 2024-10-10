import { useAuthAdmin, useQuery } from "infinity-forge";

import { RemoteLoadUserDashboard } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useMe() {
  const { user } = useAuthAdmin();

  return useQuery({
    enableCache: true,
    queryKey: "Me" + user?.user?.id,
    queryFn: async () => {
      return await container
        .get<RemoteLoadUserDashboard>(TypesAutomatiza.RemoteLoadUserDashboard)
        .load({ admin: false });
    },
  });
}
