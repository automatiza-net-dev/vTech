// @ts-nocheck
import React, { memo, useState } from "react";

import { TimelineContainer, Container } from "./styles";
import ViewOccurrence from "../../PatientList/ViewOccurrence";

import { Button } from "antd";

import moment from "moment";

/* const origin = [
  "report_occurrence",
  "hospitalization_completed",
  "prescription",
  "occurrence",
  "weight_occurrence",
  "death_occurrence",
  "scheduling_execution"
]; */

const labelControl = (str) => {
  switch (str) {
    case "RECURRENT":
      return "Recorrente";
    case "ONCE":
      return "Apenas uma vez";
    case "WHEN_NEEDED":
      return "Quando necessário";
    case "MEDICATION":
      return "Medicamento";
    case "FLUID_THERAPY":
      return "Fluidoterapia";
    case "PROCEDURE":
      return "Procedimento";
  }
};

const parseInterval = (info, val) => {
  if (!info) {
    return "-";
  }

  if (info === "HOUR") {
    return val > 1 ? "horas" : "hora";
  }

  if (info === "DAY") {
    return val > 1 ? "dias" : "dia";
  }

  return val > 1 ? "vezez" : "vez";
};

const risks = [
  { id: 1, value: "Leve" },
  { id: 2, value: "Médio" },
  { id: 3, value: "Grave" },
  { id: 4, value: "Gravíssimo" }
];

const renderTimeline = (obj, functions, allowEdit) => {
  const { setOccurrenceVisible, setOccurrenceData } = functions;
  switch (obj?.meta?.origin || obj?.meta?.type) {
    case "begin_hospitalization":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="begin-hospitalization uk-margin-remove">
              {obj?.data?.type === "Internação" && "Entrada"}
              &nbsp;
              {obj?.data?.type} {" - "} {obj?.data?.technician?.name}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                <strong>Previsão Alta:</strong>{" "}
                {moment(obj?.data?.expectedDischarge).format("DD/MM/YYYY")}
              </p>
              <p className="uk-margin-remove">
                <strong>Gravidade:</strong>
                {risks?.find((item) => item?.id === obj?.data?.risk)?.value}
              </p>
              {obj?.data?.deathAt && (
                <p className="uk-margin-remove">
                  <strong>Óbito em:</strong>{" "}
                  {moment(obj?.deathAt).format("DD/MM/YYYY - HH:mm")}
                </p>
              )}
              <br />
              {obj?.data?.releasedAt && (
                <p className="uk-margin-remove">
                  <br />
                  <strong>Alta em:</strong>{" "}
                  {moment(obj?.releasedAt).format("DD/MM/YYYY - HH:mm")}
                </p>
              )}
              <p className="uk-margin-remove">
                <strong>Queixa:</strong> {obj?.data?.complaint}
              </p>
              <br />
              <p className="uk-margin-remove">
                <strong>Diagnóstico:</strong>
                {obj?.data?.diagnosis}
              </p>
              <br />
              <p className="uk-margin-remove">
                <strong>Prognóstico: </strong>
                {obj?.data?.prognosis}
              </p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "report_occurrence":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove uk-flex uk-flex-between">
              <div>
                {obj?.data?.type} {" - "} {obj?.data?.technician?.name}
              </div>
              {allowEdit && (
                <Button
                  onClick={() => {
                    setOccurrenceVisible(true);
                    setOccurrenceData({
                      id: obj?.meta?.occurrence,
                      occurrence: {
                        id: obj?.meta?.rootOcurrence,
                        type: "RM",
                        description: "Relatório Médico"
                      },
                      executed_at: obj?.data?.realizedAt,
                      description: obj?.data?.description,
                      active: true,
                      previewed_at: obj?.data?.issuedAt,
                      resume: obj?.data?.resume,
                      user: {
                        name: obj?.data?.technician?.name,
                        id: obj?.data?.technician?.id
                      }
                    });
                  }}
                >
                  Editar
                </Button>
              )}
            </h4>
            <section className="">
              <p
                className="uk-margin-remove"
                dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
              ></p>
              <div className="uk-flex uk-flex-wrap uk-flex-middle uk-margin-remove">
                {/*<p style={{ marginRight: "3px" }}> Descrição: </p>*/}
              </div>
            </section>
          </div>
        </TimelineContainer>
      );
    case "hospitalization_completed":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove">
              Internação finalizada {" - "} {obj?.data?.technician?.name}
            </h4>
            <section className=""></section>
          </div>
        </TimelineContainer>
      );
    case "prescription":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove uk-flex">
              Prescrição médica{" - "}
              {obj?.data?.technician?.name}{" "}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                <strong>Tipo:</strong> {obj?.data?.prescription_type}
              </p>
              <p className="uk-margin-remove">
                <strong>Inicio execução:</strong>{" "}
                {moment(obj?.data?.executionStart).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
              </p>
              <p className="uk-margin-remove">
                <strong>Frequência:</strong>{" "}
                {obj?.data?.frequency === "RECURRENT" ? (
                  <span>
                    Frequência:{" "}
                    {[
                      "A cada",
                      `${obj?.data?.frequencyInterval} ${parseInterval(
                        obj?.data?.frequencyUnit,
                        obj?.data?.frequencyInterval
                      )}`,
                      "por",
                      `${obj?.data?.frequencyQuantity} ${parseInterval(
                        obj?.data?.frequencyQuantityUnit,
                        obj?.data?.frequencyQuantity
                      )}`
                    ].join(" ")}
                  </span>
                ) : (
                  <span>
                    Frequência:{" "}
                    {obj?.data?.frequency === "WHEN_NEEDED"
                      ? "Quando necessário"
                      : "Apenas uma vez"}
                  </span>
                )}
              </p>
              <p className="uk-margin-remove">
                <strong>Descrição:</strong> {obj?.data?.description}
              </p>
              <p className="uk-margin-remove">
                <strong>Resumo:</strong> {obj?.data?.resume}
              </p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "occurrence":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove uk-flex uk-flex-between">
              <div>Ocorrência - {obj?.data?.technician?.name}</div>
              {allowEdit && (
                <Button
                  onClick={() => {
                    setOccurrenceVisible(true);
                    setOccurrenceData({
                      id: obj?.meta?.occurrence,
                      occurrence: {
                        id: obj?.meta?.rootOcurrence,
                        type: "OC",
                        description: "Ocorrência"
                      },
                      executed_at: obj?.data?.realizedAt,
                      description: obj?.data?.description,
                      active: true,
                      previewed_at: obj?.data?.issuedAt,
                      resume: obj?.data?.resume,
                      user: {
                        name: obj?.data?.technician?.name,
                        id: obj?.data?.technician?.id
                      }
                    });
                  }}
                >
                  Editar
                </Button>
              )}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                <strong>
                  Data da ocorrência:&nbsp;
                  {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")}
                </strong>
              </p>
              <p className="uk-margin-remove">
                <strong>Resumo:</strong> {obj?.data?.resume}
              </p>
              <div className="uk-flex uk-flex-wrap uk-flex-middle uk-margin-remove">
                <p style={{ marginRight: "3px" }}>
                  {" "}
                  <strong>Descrição:</strong>{" "}
                </p>
                <p
                  className="uk-margin-remove"
                  dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
                ></p>
              </div>
            </section>
          </div>
        </TimelineContainer>
      );
    case "weight_occurrence":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove">
              Registro de peso - {obj?.data?.technician?.name}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                <strong>Peso:</strong> {obj?.data?.resume}Kg
              </p>
              <div className="uk-flex uk-flex-wrap uk-flex-middle">
                <p style={{ marginRight: "3px" }}>
                  <strong>Descrição:</strong>
                </p>

                <p
                  className="uk-margin-remove"
                  dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
                ></p>
              </div>
            </section>
          </div>
        </TimelineContainer>
      );
    case "death_occurrence":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="death-title uk-margin-remove">Óbito</h4>
            <section className="">
              <p className="uk-margin-remove">
                Data do óbito:{" "}
                {moment(obj?.data?.realizedAt).format("DD/MM/YYYY - HH:mm")}
              </p>
              <p className="uk-margin-remove">
                Profissional responsável: {obj?.data?.technician?.name}
              </p>
              <br />
              <p className="uk-margin-remove">
                <strong>Relatório óbito:</strong>
              </p>
              <p
                className="uk-margin-remove"
                dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
              ></p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "scheduling_execution":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove">
              Execução prescrição {" - "}
              {obj?.data?.technician?.name}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                <strong>Tipo:</strong>{" "}
                {labelControl(obj?.data?.prescription_type)}
              </p>
              <p className="uk-margin-remove">
                <strong>Data execução:</strong>{" "}
                {moment(obj?.executedAt).format("DD/MM/YYYY - HH:mm")}
              </p>
              <p className="uk-margin-remove">
                <strong>Resumo:</strong> {obj?.data?.resume}
              </p>
              <p className="uk-margin-remove">
                <strong>Observação:</strong>
                {obj?.data?.description}
              </p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "hospitalization_release":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove">
              Alta Internação {" - "}
              {obj?.data?.technician?.name}
            </h4>
            <section className="">
              <p className="uk-margin-remove">
                Data da alta:{" "}
                {moment(obj?.data?.realizedAt).format("DD/MM/YYYY - HH:mm")}
              </p>
              <p className="uk-margin-remove">
                <strong>Tipo:</strong>
                {obj?.data?.releaseType}
              </p>
              <br />
              <p className="uk-margin-remove">
                <strong>Relatório da alta:</strong>
                <p
                  className="uk-margin-remove"
                  dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
                ></p>
              </p>
            </section>
          </div>
        </TimelineContainer>
      );

    case "hospitalization_completed":
      return (
        <TimelineContainer className="uk-flex uk-margin-top">
          <div className="uk-width-1-5">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            <br />
            {moment(obj?.createdAt).format("HH:mm")}
          </div>
          <div className="uk-width-1-1">
            <h4 className="type-title uk-margin-remove">
              Finalização da internação {" - "}
              {obj?.data?.technician?.name}
            </h4>
          </div>
        </TimelineContainer>
      );
  }
};

const Timeline = memo(function Timeline({
  data,
  patientData,
  setReload,
  allowEdit
}) {
  const [occurrenceVisible, setOccurrenceVisible] = useState(false);
  const [occurrenceData, setOccurrenceData] = useState({});

  const functions = {
    setOccurrenceVisible,
    setOccurrenceData
  };

  return (
    <Container>
      {data?.length > 0 ? (
        data?.map((item) => renderTimeline(item, functions, allowEdit))
      ) : (
        <p className="uk-text-muted">Nenhum registro para ser apresentado</p>
      )}
      <hr />
      {/* {modal && (
        <footer className="uk-flex uk-flex-right uk-width-1-2">
          <Button onClick={() => setVisible(false)}>Fechar</Button>
        </footer>
      )} */}
      <ViewOccurrence
        visible={occurrenceVisible}
        setVisible={setOccurrenceVisible}
        occurrenceData={occurrenceData}
        patientData={patientData}
        setReload={setReload}
      />
    </Container>
  );
});

export default Timeline;
