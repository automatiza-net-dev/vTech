import { useQuery } from "react-query";

import { RemoteTutor } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllProfessions() {
  return useQuery({
    queryKey: ["LoadAllProfessions"],
    queryFn: async () => {
      const response = await container
        .get<RemoteTutor>(TypesAutomatiza.RemoteTutor)
        .loadAllProfessions();

      return response;
    },
    ...callApiOneTime,
  });
}
