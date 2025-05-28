import { useQuery } from "@/presentation/use-query";
import { callApiOneTime } from "@/presentation";

import { RemotePatientAnimal } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { LoadAllRaces } from "@/domain";

export function useLoadAllRaces(props: LoadAllRaces.Params) {

  async function fetcher() {
    const response = await container
      .get<RemotePatientAnimal>(TypesAutomatiza.RemotePatientAnimal)
      .loadAllRaces(props);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllRaces", props],
    queryFn: fetcher,
    enableCache: true
  });
}
