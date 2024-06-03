import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CalendarOptions } from "@fullcalendar/core";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import interactionPlugin from "@fullcalendar/interaction";

export const calendarConfigurations: CalendarOptions = {
  timeZone: "local",
  initialView: "timeGridDay",
  locale: ptLocale,
  allDaySlot: false,
  selectable: true,
  height: "auto",
  headerToolbar: {
    left: "",
    center: "title",
    right: "",
  },
  editable: false,
  eventOverlap: false,
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
  },
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
};
