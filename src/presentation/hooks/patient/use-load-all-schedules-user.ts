import { useQuery } from "infinity-forge";

import { container, patientTypes } from "@/container";
import {
  RemoteLoadAllSchedulesUser,
  RemoteLoadAllSchedulesUsersWeek,
} from "@/data";

export function useLoadAllSchedulesUser({
  to,
  from,
  enabled = true,
  lista_cancelados,
}: {
  to: string;
  from: string;
  lista_cancelados?: boolean;
  enabled?: boolean;
}) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadAllSchedulesUser>(patientTypes.RemoteLoadAllSchedulesUser)
      .loadAll({ from, to, lista_cancelados });

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadAllSchedulesUser" + to + lista_cancelados,
    queryFn: fetcher,
    enabled,
  });
}

export function useLoadAllSchedulesUserWeek(
  to: string,
  from: string,
  users?: string[],
  lista_cancelados?: boolean
) {
  async function fetcher() {
    if (users) {
      const response = await container
        .get<RemoteLoadAllSchedulesUsersWeek>(
          patientTypes.RemoteLoadAllSchedulesUsersWeek
        )
        .loadAll({ users, from, to, lista_cancelados });

      return response;
    }

    return null;
  }

  const refetchKeyWeekCalendar =
    "RemoteLoadAllSchedulesUserWeek" +
    to +
    from +
    users?.map((u) => u) +
    lista_cancelados;

  const query = useQuery({
    queryKey: refetchKeyWeekCalendar,
    queryFn: fetcher,
    enabled: users && users.length > 0,
  });

  return { ...query, refetchKeyWeekCalendar };
}
