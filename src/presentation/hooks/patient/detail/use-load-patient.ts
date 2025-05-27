import { useQuery } from "infinity-forge";

import { useRouter } from "next/router";

import { Patient } from "@/domain";
import { RemotePatient } from "@/data";
import { container, patientTypes } from "@/container";

export function useLoadPatient(patientId?: Patient["id"]) {
  const router = useRouter();
  const ID = patientId || (router?.query?.id as string);

  async function fetcher() {
    const response = await container
      .get<RemotePatient>(patientTypes.RemotePatient)
      .load({ patientId: ID });

    return response;
  }

  return useQuery({
    queryKey: ["RemotePatient", ID],
    queryFn: fetcher,
     
    enabled: !!(ID && router.isReady),
  });
}
