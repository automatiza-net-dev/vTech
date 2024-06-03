import moment from "moment";
import { useActionsPatient } from "../../actions/actions/options";

import { CardTimeLineProps } from "./interfaces";

import * as S from "./styles";

export function CardTimeLine({
  timeline,
  timeLineSelected,
  setTimeLineSelected,
}: CardTimeLineProps) {
  const actionsPatient = useActionsPatient();

  const Action = actionsPatient.list?.find(
    (action) =>
      action.value === timeline?.timeline_type?.description ||
      action.value === timeline?.timeline_info?.event
  );

  const isTimeLineSelected = timeLineSelected?._id === timeline._id;
  const isChangeTutor =
    timeline?.timeline_info?.event === "TROCA_TUTOR_PRINCIPAL";
  const isPhotosAndVideos = timeline.timeline_type.description === "Fotos";

  const verifyFile = () => {
    if (
      timeline?.timeline_info?.attachments &&
      timeline?.timeline_info?.attachments?.length > 0
    ) {
      return true;
    }

    if (
      timeline?.timeline_info?.photos &&
      timeline?.timeline_info?.photos?.length > 0
    ) {
      return true;
    }

    if (
      timeline?.timeline_info?.medias &&
      timeline?.timeline_info?.medias?.length > 0
    ) {
      return true;
    }
  };

  return (
    <S.CardTimeLine
      $isTimeLineSelected={isTimeLineSelected}
      type="button"
      className="time_line"
      onClick={() => {
        if (isChangeTutor) {
          return;
        }

        setTimeLineSelected(timeline);
      }}
    >
      <div className="top">
        <div className="text">
          <h3>
            {moment(timeline.createdAt).format("DD/MM/YYYY")}
            <strong> às {moment(timeline.createdAt).format("HH:mm")}</strong>
          </h3>
          {timeline?.timeline_type.description}
          {timeline?.timeline_info?.technician?.name && (
            <span>{timeline.timeline_info.technician.name}</span>
          )}

          {isPhotosAndVideos && (
            <>
              <span>Fotos e vídeos</span>
              <span>{timeline.timeline_info.title}</span>
            </>
          )}

          {timeline?.timeline_info?.exam?.name && (
            <>
              <span>{timeline.timeline_info.exam.name}</span>
            </>
          )}

          {timeline?.timeline_info?.type && (
            <span>{timeline?.timeline_info?.type}</span>
          )}

          {timeline.timeline_type.description === "Peso" && (
            <span>
              Peso <br />
              Registro: {timeline.timeline_info.weight}kg
            </span>
          )}

          {isChangeTutor && (
            <span>
              <strong>Troca</strong> {timeline?.timeline_info?.old_tutor.name}{" "}
              <br /> <strong>Para</strong>:{" "}
              {timeline?.timeline_info?.new_tutor.name}
            </span>
          )}

          {timeline?.timeline_type.description === "Vacinas" && (
            <span>
              {timeline.timeline_info.origin === "new_vaccine"
                ? "Lançamento Vacina:"
                : "Aplicação Vacina"}
              <br />
              <strong>{timeline?.timeline_info?.vaccine?.name}</strong>
            </span>
          )}
        </div>

        <div className="icons">
          {Action?.Icon && Action?.Icon}

          {verifyFile() && (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"></path>
            </svg>
          )}
        </div>
      </div>
    </S.CardTimeLine>
  );
}
