// @ts-nocheck
import { useRouter } from "next/router";

import { BsPlusLg } from "react-icons/bs";
import { FcAlarmClock } from "react-icons/fc";

import { useAuth } from "@/OLD/hooks/useAuth";

import moment from "moment";
import masks from "@/OLD/utils/masks";

import { Container, Tag, TagAdd } from "./styles";
import { Tag as AntdTag, Tooltip } from "antd";

export function PatientCard({
  color,
  data,
  index,
  confirmed
}) {
  const router = useRouter();

  const { patient, holder, user, serviceType, serviceStatus } = data;

  const { setCalendarData } = useAuth();

  const systemName = process.env.clientName;

  const timeDiff = moment(new Date(), "YYYY-MM-DD[T]HH:mm:ss").diff(
    moment(data?.start_hour, "YYYY-MM-DD[T]HH:mm:ss"),
    "minutes"
  );

  return (
    <Container
      host={systemName}
      color={color}
      onClick={() => {
        setCalendarData({ date: moment(data?.start_hour), eventId: data?.id });
        router.push("/dashboard/agenda");
      }}
    >
      <div className="header">
        <img
          id={`pet-image-${index}-${confirmed ? "confirmado" : "confirmar"}`}
          src={`${process.env.NEXT_PUBLIC_API}${patient?.photo}`}
          onError={() => {
            const imagePet = document.querySelector(
              `#pet-image-${index}-${confirmed ? "confirmado" : "confirmar"}`
            );

            if (systemName === "LiftOne") {
              imagePet.src =
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
            } else {
              imagePet.src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnr0cXPGQV9g1WCJydjx3jxawvD6wS52PaMQ&usqp=CAU";
            }
          }}
        />
        <div className="patient-info">
          <h3>
            <Tooltip title="clique para editar os dados do paciente">
              <span
                className="uk-link paciente-name"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/paciente/editar/${patient?.id}`);
                }}
              >
                {patient?.name}
              </span>
            </Tooltip>
          </h3>
          {systemName !== "LiftOne" && (
            <h6>
              Tutor(a):{" "}
              <Tooltip title="clique para editar os dados do tutor">
                <span
                  className="uk-link tutor-name"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/tutor/editar/${holder?.id}`);
                  }}
                >
                  {holder?.name}
                </span>
              </Tooltip>
            </h6>
          )}
          <h6>
            Tel.:{" "}
            {holder?.tutor?.cellphone
              ? masks?.phone(holder?.tutor?.cellphone)
              : ""}
          </h6>
        </div>
      </div>
      <div className="tags-container" style={{ marginBottom: "10px" }}>
        {systemName !== "LiftOne" && (
          <>
            <Tag color={color}>{patient?.patientAnimal?.race?.description}</Tag>
            <TagAdd>
              <BsPlusLg size={10} /> Nova Tag
            </TagAdd>
          </>
        )}
      </div>
      <div className="uk-text-center">
        <p className="uk-margin-remove">
          <strong>Dr. (a) {user?.name}</strong>
        </p>
        <p className="uk-margin-remove">{serviceType?.description}</p>
      </div>
      <div className="note">{data?.major_complaint}</div>
      <AntdTag
        color={serviceStatus?.color}
        className="uk-margin-small-top uk-text-center"
      >
        {serviceStatus?.description}
      </AntdTag>
      <div className="footer">
        <div className="level-emergency">
          <FcAlarmClock size={30} />{" "}
          {moment(data?.start_hour, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM")} -
          {moment(data?.start_hour, "YYYY-MM-DD[T]HH:mm:ss").format("HH:mm")}
        </div>
      </div>
      {confirmed && timeDiff > 0 && data?.serviceStatus?.type === "AC" && (
        <div className="uk-text-center">Atrasado - {timeDiff} Minutos</div>
      )}
    </Container>
  );
};
