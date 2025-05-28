import { RemoteBusinessUnits } from "@/data";
import { adminTypes, container } from "@/container";
import { useQuery } from "@/presentation/use-query";

export function useLoadAllBusinessUnits() {
  async function fetcher() {
    return await container.get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits).loadAll();
  }

  return useQuery({
    queryKey: ["RemoteLoadAllBusinessUnits"],
    queryFn: fetcher,
    enableCache: true
  });
}


export function useLoadAllBusinessUnitsSystem() {
  async function fetcher() {
    return await container.get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits).loadAllSystem();
  }

  return useQuery({
    queryKey: ["RemoteLoadAllBusinessUnitsSystem"],
    queryFn: fetcher,
    enableCache: true
  });
}
