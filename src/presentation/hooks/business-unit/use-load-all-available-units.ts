import { useQuery } from "react-query";

import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";
import { useAuthAdmin } from "infinity-forge";
import { User } from "@/domain";

export function useLoadAllAvailableUnits() {
  const { GetUser } = useAuthAdmin();

  const user = GetUser<User>();

  async function fetcher() {
    const response = await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllAvailableSwaps({ dashboard: true });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllAvailableUnits", user?.user?.id],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
