import { Error,Icon } from "infinity-forge";

import { Actions } from "./actions";
import { UserInfos } from "./user-info";
import { Event, ScheduleUser } from "@/domain";
import { DateToDDMMYYYY } from "@/presentation";

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
            <Icon name="CloseIcon" />
          </button>

          <span>{infos.title}</span>
        </div>

        <div className="status">
          <span>{infos.status}</span>
        </div>

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
