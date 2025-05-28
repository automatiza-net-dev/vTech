import { useQuery } from "@/presentation/use-query";

import * as domain from "@/domain";
import { RemoteLoadSchedulesPatient } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSchedulesToMovement(
  params: domain.LoadAllSchedullingToMovement.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadSchedulesPatient>(
        TypesAutomatiza.RemoteLoadSchedulesPatient
      )
      .loadSchedullingToMovement(params);

    return response;
  }

  const queryKey = useLoadSchedulesToMovementKEY(params);

  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: !!params?.patientId,
  });
}

export function useLoadSchedulesToMovementKEY(
  params: domain.LoadAllSchedullingToMovement.Params
) {
  return ["RemoteLoadASchedulesToMovement", params ? JSON.stringify(params) : ""];
}
