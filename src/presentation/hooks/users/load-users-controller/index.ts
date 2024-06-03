import { useQuery } from "react-query";

import { RemoteUserController } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useLoadUsersController() {
  
  async function fetcher() {
    const response = await container.get<RemoteUserController>(adminTypes.RemoteUserController).load();

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadUserControllers",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
