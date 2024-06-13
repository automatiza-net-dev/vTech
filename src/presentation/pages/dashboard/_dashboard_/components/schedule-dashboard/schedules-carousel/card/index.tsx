import { useState } from "react";

import moment from "moment";
import {
  HighlightText,
  SideBar,
  NextImage,
  Error,
  Tooltip,
} from "infinity-forge";

import { Event } from "@/domain";
import { IconCalendar } from "./icon";
import { SideBarContent } from "@/presentation";

import * as S from "./styles";

export function ScheduleCard(props: Event) {
  const [open, setOpen] = useState(false);
  const { holder, patient, endHour, startHour, serviceType, serviceStatus } =
    props.event;

  const timeTextStart = props.start?.substring(11, 16);
  const timeTextEnd = props.end?.substring(11, 16);
  const fullTime = timeTextStart + " - " + timeTextEnd;

  const isLongDescription = serviceType?.description.length > 200;

  return (
    <Error name="ScheduleCard">
      <SideBar open={open} setOpen={setOpen} maxWidth="400px" overlay>
        <SideBarContent
          event={props}
          viewCalendar={"day"}
          setOpen={setOpen}
          timeText={fullTime}
          scheduleUser={null as any}
          refetchKeyWeekCalendar={undefined}
        />
      </SideBar>

      <S.ScheduleCard type="button" onClick={() => setOpen(true)}>
        <div className="top">
          <div className="avatar">
            <NextImage src={patient?.photo || "/images/default-profile.png"} />
          </div>

          <div>
            {patient?.name && <h4>{patient.name}</h4>}
            {patient?.race && patient?.specie && (
              <span>{patient?.specie + " > " + patient?.race}</span>
            )}

            {holder?.tutor?.cellphone && holder.name && (
              <span>
                {holder.name} • {holder?.tutor?.cellphone}
              </span>
            )}
          </div>
        </div>

        <div className="bottom">
          {props?.name && <h5>Dr. (a) {props?.name}</h5>}

          {serviceType.type && (
            <p className="service_type">{serviceType.type}</p>
          )}

          {isLongDescription ? (
            <Tooltip
              trigger={
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: serviceType?.description }}
                />
              }
              content={serviceType?.description}
            />
          ) : (
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: serviceType?.description }}
            />
          )}
        </div>

        {serviceStatus.description && (
          <div
            style={{ background: serviceStatus.color }}
            className="status-bar"
          >
            {serviceStatus.description}
          </div>
        )}

        <div className="time_box">
          {props.date && (
            <span className="date">
              <IconCalendar />
              {props.date}
            </span>
          )}

          {props.late && (
            <span className="timeDiff">
              <HighlightText
                text={`${props.late} min atrasado`}
                color="#E02F2F"
              />
            </span>
          )}
        </div>
      </S.ScheduleCard>
    </Error>
  );
}
