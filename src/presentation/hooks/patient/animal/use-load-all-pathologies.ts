import { useQuery } from "infinity-forge";
import { callApiOneTime } from "@/presentation";

import { RemotePatientAnimal } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllPathologies() {

  async function fetcher() {
    const response = await container
      .get<RemotePatientAnimal>(TypesAutomatiza.RemotePatientAnimal)
      .loadAllPathologies();

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllPathologies"],
    queryFn: fetcher,
    enableCache: true
  });
}
