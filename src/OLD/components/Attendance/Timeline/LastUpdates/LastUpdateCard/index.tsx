// @ts-nocheck
// Core
import React, { memo, useEffect } from "react";

// Components
import { Card } from "antd";
import { Container } from "./styles";
import Print from "@/OLD/components/mini-components/Print";

// Utils
import moment from "moment";

// Icons
import { BsPaperclip } from "react-icons/bs";
import { Document } from "@styled-icons/fluentui-system-filled/Document";
import { BriefcaseMedical } from "@styled-icons/fluentui-system-filled/BriefcaseMedical";
import { Videos } from "@styled-icons/boxicons-solid/Videos";
import { Dna } from "@styled-icons/boxicons-regular/Dna";
import { DocumentOnePage } from "@styled-icons/fluentui-system-filled/DocumentOnePage";
import { FileMedical } from "@styled-icons/fa-solid/FileMedical";
import {
  FaBalanceScaleLeft,
  FaNotesMedical,
  FaAmbulance,
} from "react-icons/fa";

const controlObservation = (str) => {
  const obs = str?.split(" ");
  return !obs && obs?.length < 3 ? str : (obs[0], obs[1], obs[2]);
};

const iconControl = (str) => {
  switch (str) {
    case "Peso":
      return <FaBalanceScaleLeft size={30} />;
    case "Documento":
      return <Document size={30} />;
    case "Observação":
      return <DocumentOnePage size={30} />;
    case "Formato Receita Médica":
      return <FileMedical size={30} />;
    case "Patologia":
      return <Dna size={30} />;
    case "Fotos":
      return <Videos size={30} />;
    case "Vacinas":
      return (
        <img
          src="https://cdn-icons-png.flaticon.com/512/2212/2212190.png"
          width="30"
        />
      );
    case "Consulta":
      return <FaNotesMedical size={30} />;
    case "Hospitalização":
      return <FaAmbulance size={30} />;
    case "Exames":
      return <BriefcaseMedical size={30} />;
    default:
      return "";
  }
};

const showInf = (obj) => {
  switch (obj?.timeline_type?.description) {
    case "Peso":
      return (
        <div>
          <p className="uk-margin-remove">Peso</p>
          <p className="uk-margin-remove">
            Registro: {obj?.timeline_info?.weight}Kg
          </p>
        </div>
      );
    case "Consulta":
      return obj?.timeline_info?.event !== "TROCA_TUTOR_PRINCIPAL" ? (
        <div>
          <p className="uk-margin-remove">Atendimento</p>
          <p className="uk-margin-remove">
            {obj?.timeline_info?.service?.description}
          </p>
        </div>
      ) : (
        <div>
          <p className="uk-margin-remove">
            {obj?.timeline_info?.event.toLowerCase().replaceAll("_", " ")}
          </p>
          <p className="uk-margin-remove">
            <strong>{obj?.timeline_info?.type}</strong>
          </p>
          <section>
            {obj?.timeline_info?.old_tutor?.name && (
              <p className="uk-margin-remove">
                De: {obj?.timeline_info?.old_tutor?.name}
              </p>
            )}
            <p className="uk-margin-remove">
              Para: {obj?.timeline_info?.new_tutor?.name}
            </p>
          </section>
          <p className="uk-margin-remove">{obj?.timeline_info?.complaint}</p>
        </div>
      );
    case "Fotos":
      return (
        <div>
          Fotos <br /> {obj?.timeline_info?.title}
        </div>
      );
    case "Patologia":
      return (
        <div>
          <p className="uk-margin-remove">Patologia</p>
          <p className="uk-margin-remove">{obj?.timeline_info?.description}</p>
        </div>
      );
    case "Formato Receita Médica":
      return (
        <div>
          <p className="uk-margin-remove">Receita médica</p>
          <p className="uk-margin-remove">{obj?.timeline_info?.name}</p>
        </div>
      );
    case "Observação":
      return (
        <div>
          <p className="uk-margin-remove">Observações</p>
          {obj?.timeline_info?.observation &&
            controlObservation(obj?.timeline_info?.observation)}
        </div>
      );
    case "Documento":
      return (
        <div>
          <p className="uk-margin-remove">Documento</p>
          <p className="uk-margin-remove"> {obj?.timeline_info?.type} </p>
        </div>
      );
    case "Vacinas":
      return (
        <div>
          {obj?.timeline_info?.origin === "new_vaccine"
            ? "Lançamento"
            : "Aplicação"}
          <p className="uk-margin-remove">Vacina</p>
          {obj?.timeline_info?.vaccine?.name}
        </div>
      );
    case "Hospitalização":
      return (
        <div>
          <p className="uk-margin-remove">Internação</p>
          <p className="uk-margin-remove">
            <strong>
              {obj?.timeline_info?.completedAt
                ? "Registro de alta"
                : "Registro de entrada"}
            </strong>
          </p>
          <p className="uk-margin-remove">{obj?.timeline_info?.complaint}</p>
        </div>
      );
    case "Exames":
      return (
        <div>
          <p className="uk-margin-remove">
            <strong>Exame</strong>
          </p>
          <p className="uk-margin-remove">{obj?.timeline_info?.exam?.name}</p>
        </div>
      );
    case "Glicemia":
      return (
        <div>
          <p className="uk-margin-remove">
            <strong>Glicemia</strong>
          </p>
          <p className="uk-margin-remove">
            Registro: {obj?.timeline_info?.value}
          </p>
        </div>
      );
    case "Aferição de Pressão":
      return (
        <div>
          <p className="uk-margin-remove">
            <strong>{obj?.timeline_type?.description}</strong>
          </p>
          <p className="uk-margin-remove">
            Pressão aferida: {obj?.timeline_info?.pressure}
          </p>
        </div>
      );
    case "Avaliação":
      return (
        <div>
          <p className="uk-margin-remove">
            <strong>{obj?.timeline_type?.description}</strong>
          </p>
          <p className="uk-margin-remove">
            {obj?.timeline_info?.service?.description}
          </p>
        </div>
      );
  }
};

const LastUpdateCard = memo(function ({
  updateList,
  setSelectedUpdate,
  reload,
}) {
  useEffect(() => {
    setSelectedUpdate((prv) =>
      updateList?.find((item) => item?.id === prv?.id)
    );
  }, [updateList]);

  return (
    <Container>
      {updateList?.length > 0 &&
        updateList.map((update, i) => {
          return (
            <div>
              {(i === 0 ||
                moment(update?.createdAt).format("MM/YYYY") !==
                  moment(updateList[i - 1]?.createdAt).format("MM/YYYY")) && (
                <div className="uk-margin-top">
                  <h5 className="uk-margin-remove">
                    <strong>
                      {moment(update?.createdAt).format("MM/YYYY")}
                    </strong>
                  </h5>
                </div>
              )}
              <Card
                size="small"
                className="uk-width-5-6 card-box"
                key={i}
                onClick={() => {
                  setSelectedUpdate(false);
                  update?.timeline_info?.event !== "TROCA_TUTOR_PRINCIPAL" &&
                    setTimeout(() => setSelectedUpdate(update), 100);
                }}
              >
                <div className="uk-flex uk-flex-between">
                  <section className="uk-flex">
                    <div className="uk-margin-left">
                      <p className="uk-margin-remove">
                        <strong>
                          {moment(update?.createdAt).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                          &nbsp;-&nbsp;
                          {update?.timeline_info?.technician?.name}
                        </strong>
                      </p>
                      {update?.timeline_info?.event === "OBITO" && (
                        <>
                          <p className="uk-margin-remove">Óbito do paciente</p>
                          <p className="uk-margin-remove">
                            Data:{" "}
                            {moment(update?.timeline_info?.realized).format(
                              "DD/MM/YYYY - HH:mm"
                            )}
                          </p>
                        </>
                      )}
                      <span>{showInf(update)}</span>
                    </div>
                  </section>
                  <section>
                    <div>{iconControl(update?.timeline_type?.description)}</div>
                    <div className="uk-margin-top">
                      {update?.timeline_info?.medias?.length > 0 && (
                        <BsPaperclip size={25} />
                      )}
                      {update?.timeline_info?.attachments?.length > 0 && (
                        <BsPaperclip size={25} />
                      )}
                      {update?.timeline_info?.photos?.length > 0 && (
                        <BsPaperclip size={25} />
                      )}
                    </div>
                  </section>
                </div>
              </Card>
            </div>
          );
        })}
    </Container>
  );
});

export default LastUpdateCard;
