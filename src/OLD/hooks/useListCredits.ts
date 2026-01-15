import { api, useQuery } from "infinity-forge";

export function useTutorCredits(tutorID: string, enabled = true) {
  return useQuery({
    enabled,
    enableCache: false,
    interval: '5s',
    queryKey: ["tutor-credits", tutorID],
    queryFn: async () => {
      console.log({ tutorID, enabled });
      const result = await api({
        url: `patient-tutors/credits/${tutorID}`,
        method: "get",
      });

      return result as {
        id: number;
        originalValue: number;
        usedValue: number;
        created_at: string;
      }[];
    },
  });
}
