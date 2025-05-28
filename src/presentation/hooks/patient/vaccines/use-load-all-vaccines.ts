import { useQuery } from "@/presentation/use-query";

import { RemoteVaccine } from "@/data";
import { LoadAllVaccines } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllVaccines(params: LoadAllVaccines.Params) {
  async function fetcher() {
    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadAllVaccines(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllVaccines", params],
    queryFn: fetcher,
   enableCache: true
  });
}
