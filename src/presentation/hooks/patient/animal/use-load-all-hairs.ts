import { useQuery } from "react-query";

import { RemotePatientAnimal } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllHairs() {

  async function fetcher() {
    const response = await container
      .get<RemotePatientAnimal>(TypesAutomatiza.RemotePatientAnimal)
      .loadAllHairs();

    return response;
  }

  return useQuery({
    queryKey: ["useLoadAllHairs"],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
