import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CalendarOptions } from "@fullcalendar/core";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import interactionPlugin from "@fullcalendar/interaction";

export const configsWeekCalendar: CalendarOptions = {
    timeZone: "local",
    initialView: "timeGridWeek",
    locale: ptLocale,
    allDaySlot: false,
    selectable: true,
    height: "auto",

    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "",
    },
    slotDuration: "01:00:00",
    slotLabelInterval: "01:00:00",
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  };