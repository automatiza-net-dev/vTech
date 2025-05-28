import { useRouter } from "next/router";
import { useQuery } from "@/presentation/use-query";

import { RemoteVaccine } from "@/data";
import { LoadVaccineProtocols } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllVaccinesProtocols(
  params: LoadVaccineProtocols.Params & { fetch: boolean }
) {
  const router = useRouter();

  async function fetcher() {
    const newObj = {
      ...params,
      type: router?.pathname?.includes("vacinas") ? "vaccine" : "vermifuge",
    };

    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadAllProtocols(newObj);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllVaccineProtocols", params],
    queryFn: fetcher,
    
    enabled: params?.fetch ?? false,
  });
}
