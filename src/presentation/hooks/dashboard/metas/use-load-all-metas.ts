import { useQuery } from "infinity-forge";

import { RemoteMetas } from "@/data";
import { container, metasTypes } from "@/container";

export function useLoadAllMetas() {
  async function fetcher() {
    const response = await container
      .get<RemoteMetas>(metasTypes.RemoteMetas)
      .loadAll({});

    return response.map((res) => {
      return {
        ...res,
        type: [res?.type],
      };
    });
  }

  return useQuery({
    queryKey: ["LoadAllMetas"],
    queryFn: fetcher,
    
  });
}
