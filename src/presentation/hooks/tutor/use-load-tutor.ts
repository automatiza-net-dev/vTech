import { useQuery } from "react-query";

import { RemoteTutor } from "@/data";
import { Tutor } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadTutor(tutorId?: Tutor["id"]) {
  return useQuery({
    queryKey: ["LoadTutor", tutorId],
    queryFn: async () => {
      if (!tutorId) {
        return;
      }

      const response = await container
        .get<RemoteTutor>(TypesAutomatiza.RemoteTutor)
        .load({ id: tutorId });

      return response;
    },
    ...callApiOneTime,
    enabled: !!tutorId,
  });
}
