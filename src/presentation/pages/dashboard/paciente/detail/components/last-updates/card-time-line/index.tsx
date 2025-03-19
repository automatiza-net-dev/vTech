import moment from "moment";

import { useSystem } from "@/presentation";
import { useActionsPatient } from "../../actions/actions/options";

import { CardTimeLineProps } from "./interfaces";

import * as S from "./styles";

export function CardTimeLine({
  timeline,
  timeLineSelected,
  setTimeLineSelected,
}: CardTimeLineProps) {
  const actionsPatient = useActionsPatient();

  const {unit} = useSystem()

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

  const labelControl = (info) => {
    switch (info.event) {
      case "OBITO":
        return <span>Óbito</span>;
      case "TROCA_TUTOR_PRINCIPAL":
        return <span>Troca tutor principal</span>;
      case "INTERNACAO":
        return <span>Internação</span>;
      case "ALTA":
        return (
          <>
            <div>
              <span>Alta Internação</span>
            </div>
            <div>
              <span>{info.resume}</span>
            </div>
          </>
        );
      default:
        return (
          <div>
            <span>{timeline?.timeline_type.description}</span>;
            {timeline?.timeline_type.description === "Consulta" && (
              <span>{timeline?.timeline_info?.service?.description}</span>
            )}
          </div>
        );
    }
  };

  return (
    <S.CardTimeLine
      $isTimeLineSelected={isTimeLineSelected}
      type="button"
      className="time_line"
      onClick={() => {
        setTimeLineSelected(timeline);
      }}
    >
      <div className="top">
        <div className="text">
          <h3>
            {moment(timeline.createdAt).format("DD/MM/YYYY")}
            <strong> às {moment(timeline.createdAt).format("HH:mm")}</strong>
          </h3>
          {labelControl(timeline?.timeline_info)}
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
          {timeline?.timeline_type.description === "Vermifugos" && (
            <span>
              {timeline.timeline_info.origin === "new_vermifuge"
                ? "Lançamento Vermifugo:"
                : "Aplicação Vermifugo"}
              <br />
              <strong>{timeline?.timeline_info?.vaccine?.name}</strong>
            </span>
          )}
        </div>
        <div className="icons">
          {Action?.Icon && Action?.Icon}
          {unit.system.type !== "Vet" &&
            timeline?.timeline_info?.$meta?.bill_document_id && (
              <svg
                id="Capa_1"
                enableBackground="new 0 0 512 512"
                height="512"
                viewBox="0 0 512 512"
                width="512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill={timeline?.timeline_info?.print ? "green" : "red"}>
                  <path d="m481 124.241v-17.241c0-24.813-20.187-45-45-45h-15v-47c0-8.284-6.716-15-15-15h-300c-8.284 0-15 6.716-15 15v47h-15c-24.813 0-45 20.187-45 45v17.241c-17.977 5.901-31 22.833-31 42.759v120c0 24.813 20.187 45 45 45h46v165c0 8.284 6.716 15 15 15h300c8.284 0 15-6.716 15-15v-165h46c24.813 0 45-20.187 45-45v-120c0-19.926-13.023-36.858-31-42.759zm-60-32.241h15c8.271 0 15 6.729 15 15v15h-30zm-300-62h270v92h-270zm-60 77c0-8.271 6.729-15 15-15h15v30h-30zm330 375h-270v-210h270zm91-195c0 8.271-6.729 15-15 15h-46v-30h15c8.284 0 15-6.716 15-15s-6.716-15-15-15h-360c-8.284 0-15 6.716-15 15s6.716 15 15 15h15v30h-46c-8.271 0-15-6.729-15-15v-120c0-8.271 6.729-15 15-15h422c8.271 0 15 6.729 15 15z" />
                  <path d="m156 182h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m166 332h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
                  <path d="m166 392h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
                  <path d="m166 452h180c8.284 0 15-6.716 15-15s-6.716-15-15-15h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
                </g>
              </svg>
            )}
          {verifyFile() && (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
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
