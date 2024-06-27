import { useQuery } from "react-query";
import { callApiOneTime } from "@/presentation";

import { RemotePatientAnimal } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { LoadAllSpecies } from "@/domain";

export function useLoadAllSpecies(props: LoadAllSpecies.Params) {

  async function fetcher() {
    const response = await container
      .get<RemotePatientAnimal>(TypesAutomatiza.RemotePatientAnimal)
      .loadAllSpecies(props);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllSpecies", props],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
