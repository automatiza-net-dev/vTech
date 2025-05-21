import { useQuery } from "infinity-forge";

import {  RemotePatient } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadBeds() {

  async function fetcher() {
    const response = await container
      .get<RemotePatient>(patientTypes.RemotePatient)
      .loadBeds({ active: true });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadBeds"],
    queryFn: fetcher,
    enableCache: true
  });
}


