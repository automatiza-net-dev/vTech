import useSWR from "swr";

import { RemoteLoadUserDashboard } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useMe() {
  return useSWR(
    "Me",
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
