
import { RemoteUserController } from "@/data";
import { adminTypes, container } from "@/container";
import { useQuery } from "infinity-forge";

export function useLoadUsersController() {
  
  async function fetcher() {
    const response = await container.get<RemoteUserController>(adminTypes.RemoteUserController).load();

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadUserControllers"],
    queryFn: fetcher,
    enableCache: true
  });
}
