import { RemoteTutor } from "@/data";
import { Tutor } from "@/domain";
import { TypesAutomatiza, container } from "@/container";
import { useQuery } from "infinity-forge";

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
    enabled: !!tutorId,
    
  });
}
