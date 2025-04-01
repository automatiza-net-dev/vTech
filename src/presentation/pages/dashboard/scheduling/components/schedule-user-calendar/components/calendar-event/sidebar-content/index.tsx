import { api, Error, formatNumberToCurrency, Icon, useQuery } from "infinity-forge";

import { Actions } from "./actions";
import { UserInfos } from "./user-info";
import { Event, ScheduleUser } from "@/domain";
import { DateToDDMMYYYY, useSystem } from "@/presentation";

import { SidebarTabs } from "./tabs";

import * as S from "./styles";

export function SideBarContent({
  event,
  timeText,
  setOpen,
  scheduleUser,
  viewCalendar,
  refetchKeyWeekCalendar,
}: {
  event: Event;
  setOpen;
  timeText: string;
  viewCalendar: "day" | "week";
  scheduleUser: ScheduleUser;
  refetchKeyWeekCalendar?: string;
}) {
  const date = DateToDDMMYYYY(event?.start || event?.event?.start_hour);

  const infos = {
    title: `Evento em ${date} das ${timeText}`,
    status: event?.event?.serviceStatus?.description,
  };

  const isCancelled = infos.status === "Atendimento cancelado";

  return (
    <Error name="DrawerContent">
      <S.SideBarContent>
        <div className="head">
          <button
            className="reset-button close"
            type="button"
            onClick={() => setOpen(false)}
          >
            <Icon name="IconClose" />
          </button>

          <span>{infos.title}</span>
        </div>

        <div className="status">
          <span>{infos.status}</span>
        </div>

        <PatientFinances event={event} />

        <UserInfos event={event} setOpen={setOpen} />
        <Actions
          event={event}
          isCancelled={isCancelled}
          viewCalendar={viewCalendar}
          scheduleUser={scheduleUser}
          refetchKeyWeekCalendar={refetchKeyWeekCalendar}
        />
        <SidebarTabs event={event} />
      </S.SideBarContent>
    </Error>
  );
}

function PatientFinances({ event }: { event: Event }) {
  const { unit } = useSystem();

  const clientId = event?.event?.holder?.id || event?.event?.patient?.id;
  const hasFinancesShedules = unit?.configs.schedules?.show_finances_schedules;

  const { data } = useQuery({
    queryKey: ["PatientFinancess", clientId],
    queryFn: async () => {
      const response = await api({
        url: `schedules/finances/${clientId}`,
        method: "get",
      });

      return response as {
        "Valores em Atraso": number;
      }[];
    },
    enabled: hasFinancesShedules
  });

  if (!hasFinancesShedules || !data || data?.length === 0) {
    return <></>;
  }

  return (
    <div className="status" style={{ display: "flex", gap: 5 }}>
      <h3 className="font-14-bold" style={{ marginBottom: 0, color: "red" }}>Valores em aberto</h3>
      {data?.map((item, index) => {
        return <span key={index} style={{ color: "red", fontWeight: "bold" }}>{formatNumberToCurrency(item["Valores em Atraso"])}</span>;
      })}
    </div>
  );
}
