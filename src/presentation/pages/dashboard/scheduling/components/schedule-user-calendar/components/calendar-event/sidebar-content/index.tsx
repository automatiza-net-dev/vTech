import {
  Icon,
  Error,
  Button,
  Tooltip,
  useToast,
  copyToClipboard,
  generateWhatsappUrl,
  formatNumberToCurrency,
} from "infinity-forge";

import { Actions } from "./actions";
import { UserInfos } from "./user-info";
import { Event, ScheduleUser } from "@/domain";
import {
  DateToDDMMYYYY,
  useConfigurationsSystem,
  useVerifyFinanceSchedule,
} from "@/presentation";

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
  refetchKeyWeekCalendar?: any;
}) {
  const date = DateToDDMMYYYY(event?.start || event?.event?.start_hour);

  const infos = {
    title: `Evento em ${date} das ${timeText}`,
    status: event?.event?.serviceStatus?.description,
  };

  const isCancelled = infos.status === "Atendimento cancelado";

  const { createToast } = useToast();

  const { type } = useConfigurationsSystem();

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

          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              type="button"
              text="Copiar link de confirmação da agenda"
              onClick={() => {
                copyToClipboard(
                  new URL(window.location.origin).origin +
                    `/confirmacao?scheduleId=${event?.event?.id}`
                );
                createToast({
                  status: "success",
                  message:
                    "Link de confirmação copiado para sua área de trânsferencia",
                });
              }}
            />

            <Tooltip
              idTooltip="whatsapp"
              content={"Enviar link para whatsapp web"}
              position="top-right"
              enableHover
              trigger={
                <Button
                  type="button"
                  text=""
                  svg="IconWhats"
                  onClick={() => {
                    const userPhone =
                      type === "Vet"
                        ? event?.event?.holder?.tutor?.cellphone
                        : event?.event?.patient?.cellphone;

                    const scheduleId = event?.event?.id;
                    const urlForConfirmation = `${window.location.origin}/confirmacao?scheduleId=${scheduleId}`;

                    const message = `Olá! Aqui está o link para confirmar sua agenda: ${urlForConfirmation}`;

                    window.open(
                      generateWhatsappUrl({
                        phoneNumber: userPhone || "",
                        message,
                      }),
                      "_blank"
                    );
                  }}
                />
              }
            />
          </div>
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
  const { financesExpired, disableFinanceSchedule } = useVerifyFinanceSchedule({
    event,
  });

  if (disableFinanceSchedule) {
    return <></>;
  }

  return (
    <div className="status" style={{ display: "flex", gap: 5 }}>
      <h3 className="font-14-bold" style={{ marginBottom: 0, color: "red" }}>
        Valores Vencidos
      </h3>

      <span style={{ color: "red", fontWeight: "bold" }}>
        {formatNumberToCurrency(financesExpired)}
      </span>
    </div>
  );
}
