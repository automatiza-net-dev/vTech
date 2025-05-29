
import { useVerifyFinanceSchedule } from "@/presentation/pages/dashboard/scheduling/utils";
import { useQuery } from "@/presentation/use-query/use-query";

import {
  api,
} from "infinity-forge";

export function useScheduleAuthorization({ patientId }) {

 const { configsHasShowFinancesSchedules } = useVerifyFinanceSchedule({});

  const { data } = useQuery({
    queryKey: ["ScheduleFinances", patientId],
    queryFn: async () => {
      const response = await api({
        url: `schedules/finances/${patientId}`,
        method: "get",
      });

      return response as {
        "Valores Futuros": number;
        "Valores em Atraso": number;
      };
    },
    enabled: !!patientId,
  });

  const temFinancasEmAberto = configsHasShowFinancesSchedules && data?.["Valores em Atraso"]

    return { data, temFinancasEmAberto }
}