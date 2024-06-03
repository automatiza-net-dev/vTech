import { useState } from "react";
import moment from "moment";
import { HighlightText, SideBar, NextImage } from "infinity-forge";
import { Popup } from "semantic-ui-react";

import { Event } from "@/domain";
import { IconCalendar } from "./icon";
import { SideBarContent, Error } from "@/presentation";

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
          {/* {holder?.name && <h5>Dr. (a) {props?.name}</h5>} */}

          {serviceType.type && (
            <p className="service_type">{serviceType.type}</p>
          )}

          {isLongDescription ? (
            <Popup
              trigger={
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: serviceType?.description }}
                />
              }
              content={serviceType?.description}
              basic
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
          {startHour && (
            <span className="date">
              <IconCalendar />
              {moment(startHour, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM")} •
              {moment(endHour, "YYYY-MM-DD[T]HH:mm:ss").format("HH:mm")}
            </span>
          )}

          <span className="timeDiff">
            <HighlightText text={`20 min atrasado`} color="#E02F2F" />
          </span>
        </div>
      </S.ScheduleCard>
    </Error>
  );
}
