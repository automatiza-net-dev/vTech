import { useState } from "react";

import { Tooltip } from "@mui/material";
import { SideBar } from "infinity-forge";

import { Event, ScheduleUser } from "@/domain";
import { SideBarContent } from "./sidebar-content";
import { ToolTipContent } from "./tooltip-content";

export function CalendarEvent({
  event,
  scheduleUser,
  viewCalendar,
  showNameScheduleUser,
  refetchKeyWeekCalendar,
}: {
  event: Event;
  viewCalendar: "day" | "week";
  scheduleUser: ScheduleUser;
  showNameScheduleUser?: boolean;
  refetchKeyWeekCalendar?: string;
}) {
  const [open, setOpen] = useState(false);

  const title =
    event?.event?.title ||
    event.event?.patient?.name ||
    "Not mapped event-" + JSON.stringify(event.event);

  const color = event.event?.serviceStatus?.color;

  const timeTextStart = event.start.substring(11, 16);

  const timeTextEnd = event.end.substring(11, 16);

  const fullTime = timeTextStart + " - " + timeTextEnd;

  if(!event) {
    return;
  }

  const convertColorToHex = (color: string): string => {
    if (!color) {
      return "#E34646";
    }

    if (color.startsWith("#")) {
      return color;
    } else if (color.startsWith("rgb")) {
      const [r, g, b] = color.match(/\d+/g)!.map(Number);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    } else {
      return color;
    }
  };

  const convertedColor = convertColorToHex(color);

  return (
    <>
      {color && (
        <SideBar open={open} setOpen={setOpen} maxWidth="400px" overlay>
          <SideBarContent
            viewCalendar={viewCalendar}
            setOpen={setOpen}
            event={event}
            timeText={fullTime}
            scheduleUser={scheduleUser}
            refetchKeyWeekCalendar={refetchKeyWeekCalendar}
          />
        </SideBar>
      )}

      <Tooltip
        onClick={() => setOpen(true)}
        title={
          <ToolTipContent
            timeText={fullTime}
            event={event}
            scheduleUser={scheduleUser}
          />
        }
        arrow
      >
        <div
          className="fc-event-main-frame"
          style={{
            padding: "5px",
            borderLeft: `6px solid ${convertedColor}`,
            backgroundColor: "#eee",
            overflow: "hidden",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <div className="fc-event-title-container">
            <div
              className="fc-event-title fc-sticky"
              style={{ fontSize: "12px" }}
            >
              {event?.event?.holder?.name.split(" ")[0]} - {title}
            </div>

            {showNameScheduleUser && (
              <div style={{ fontSize: "11px", marginTop: 10, display: "flex" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="15px"
                  height="15px"
                  viewBox="0 0 16 16"
                  version="1.1"
                  style={{ marginRight: 5 }}
                >
                  <path
                    fill="#444"
                    d="M14 11.3c-1-1.9-2-1.6-3.1-1.7 0.1 0.3 0.1 0.6 0.1 1 1.6 0.4 2 2.3 2 3.4v1h-2v-1h1c0 0 0-2.5-1.5-2.5s-1.5 2.4-1.5 2.5h1v1h-2v-1c0-1.1 0.4-3.1 2-3.4 0-0.6-0.1-1.1-0.2-1.3-0.2-0.1-0.4-0.3-0.4-0.6 0-0.6 0.8-0.4 1.4-1.5 0 0 0.9-2.3 0.6-4.3h-1c0-0.2 0.1-0.3 0.1-0.5s0-0.3-0.1-0.5h0.8c-0.3-1-1.3-1.9-3.2-1.9 0 0 0 0 0 0s0 0 0 0 0 0 0 0c-1.9 0-2.9 0.9-3.3 2h0.8c0 0.2-0.1 0.3-0.1 0.5s0 0.3 0.1 0.5h-1c-0.2 2 0.6 4.3 0.6 4.3 0.6 1 1.4 0.8 1.4 1.5 0 0.5-0.5 0.7-1.1 0.8-0.2 0.2-0.4 0.6-0.4 1.4 0 0.4 0 0.8 0 1.2 0.6 0.2 1 0.8 1 1.4 0 0.7-0.7 1.4-1.5 1.4s-1.5-0.7-1.5-1.5c0-0.7 0.4-1.2 1-1.4 0-0.3 0-0.7 0-1.2s0.1-0.9 0.2-1.3c-0.7 0.1-1.5 0.4-2.2 1.7-0.6 1.1-0.9 4.7-0.9 4.7h13.7c0.1 0-0.2-3.6-0.8-4.7zM6.5 2.5c0-0.8 0.7-1.5 1.5-1.5s1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5-1.5-0.7-1.5-1.5z"
                  />
                  <path
                    fill="#444"
                    d="M5 13.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5z"
                  />
                </svg>
                {scheduleUser.name.split(" ")[0] +
                  " " +
                  (scheduleUser.name.split(" ").length > 1
                    ? scheduleUser.name.split(" ")[1][1]
                    : "")}
              </div>
            )}
          </div>

          {event.event && (
            <div
              className="fc-event-time"
              style={{
                color: "#000",
                fontWeight: "700",
                fontSize: "12px",
              }}
            >
              {fullTime}
            </div>
          )}
        </div>
      </Tooltip>
    </>
  );
}
