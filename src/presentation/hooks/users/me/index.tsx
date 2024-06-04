import useSWR from "swr";
import { useAuthAdmin } from "infinity-forge";

import { User } from "@/domain";
import { RemoteLoadUserDashboard } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useMe() {

  const { GetUser } = useAuthAdmin()

  const user = GetUser<User>()

  return useSWR(
    "Me" + user?.user?.id,
    async () => {
      return await container
        .get<RemoteLoadUserDashboard>(TypesAutomatiza.RemoteLoadUserDashboard)
        .load({ admin: false });
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
