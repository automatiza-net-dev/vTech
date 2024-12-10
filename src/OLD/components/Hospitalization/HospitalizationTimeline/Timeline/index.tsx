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
  { id: 4, value: "Gravíssimo" },
];

const renderTimeline = (obj, functions, allowEdit) => {
  const { setOccurrenceVisible, setOccurrenceData } = functions;
  switch (obj?.meta?.origin || obj?.meta?.type) {
    case "begin_hospitalization":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag hospitalization">
              {obj?.data?.type === "Internação" && "Entrada"}&nbsp;
              {obj?.data?.type}
            </span>

            <span className="inf-tag">
              {moment(obj?.createdAt).format("DD/MM/YYYY")}&nbsp;às&nbsp;
              {moment(obj?.createdAt).format("HH:mm")}
            </span>
            <span className="inf-tag">{obj?.data?.technician?.name}</span>
          </div>
          <div className="desc-box">
            <section>
              <span>
                <strong>Previsão Alta:&nbsp;</strong>
                {moment(obj?.data?.expectedDischarge).format("DD/MM/YYYY")}
              </span>
              <span>
                <strong>Gravidade:&nbsp;</strong>
                {risks?.find((item) => item?.id === obj?.data?.risk)?.value}
              </span>
              <span>
                <strong>Queixa:&nbsp;</strong>
                {obj?.data?.complaint}
              </span>
            </section>
            <section>
              {obj?.data?.deathAt && (
                <span>
                  <strong>Óbito em:&nbsp;</strong>
                  {moment(obj?.deathAt).format("DD/MM/YYYY - HH:mm")}
                </span>
              )}

              {obj?.data?.releasedAt && (
                <span>
                  <strong>Alta em:&nbsp;</strong>
                  {moment(obj?.releasedAt).format("DD/MM/YYYY - HH:mm")}
                </span>
              )}

              <span>
                <strong>Diagnóstico:&nbsp;</strong>
                {obj?.data?.diagnosis}
              </span>

              <span>
                <strong>Prognóstico:&nbsp;</strong>
                {obj?.data?.prognosis}
              </span>
            </section>
          </div>
        </TimelineContainer>
      );
    case "report_occurrence":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag medical-report">{obj?.data?.type}</span>
            <span className="inf-tag">
              {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")} às{" "}
              {moment(obj?.data?.realizedAt).format("HH:mm")}
            </span>
            <span className="inf-tag">{obj?.data?.technician?.name}</span>
            {allowEdit && (
              <Button
                onClick={() => {
                  setOccurrenceVisible(true);
                  setOccurrenceData({
                    id: obj?.meta?.occurrence,
                    occurrence: {
                      id: obj?.meta?.rootOcurrence,
                      type: "RM",
                      description: "Relatório Médico",
                    },
                    executed_at: obj?.data?.realizedAt,
                    description: obj?.data?.description,
                    active: true,
                    previewed_at: obj?.data?.issuedAt,
                    resume: obj?.data?.resume,
                    user: {
                      name: obj?.data?.technician?.name,
                      id: obj?.data?.technician?.id,
                    },
                  });
                }}
              >
                Editar
              </Button>
            )}
          </div>

          <section>
            <span>
              <strong>Descrição:&nbsp;</strong>
            </span>
            <span
              dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
            ></span>
          </section>
        </TimelineContainer>
      );
    case "hospitalization_completed":
      return (
        <TimelineContainer>
          <span className="inf-tag end-hospitalization">
            Internação finalizada
          </span>
          <span className="inf-tag">
            {moment(obj?.createdAt).format("DD/MM/YYYY")}
            &nbsp;às&nbsp;
            {moment(obj?.createdAt).format("HH:mm")}
          </span>

          <span className="inf-tag">{obj?.data?.technician?.name}</span>
        </TimelineContainer>
      );
    case "prescription":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag medical-presc">Prescrição médica</span>
            <span className="inf-tag">
              {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")} às{" "}
              {moment(obj?.data?.realizedAt).format("HH:mm")}
            </span>
            <span className="inf-tag">{obj?.data?.creationUser?.name}</span>
          </div>
          <section className="desc-box">
            <section>
              <span>
                <strong>Tipo:&nbsp;</strong>
                {obj?.data?.prescription_type}
              </span>
              <span>
                <strong>Inicio execução:&nbsp;</strong>
                {moment(obj?.data?.executionStart).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
              </span>
              <span>
                <strong>Frequência:&nbsp;</strong>
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
                      )}`,
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
              </span>
            </section>
            <section>
              <span>
                <strong>Descrição:&nbsp;</strong>
                {obj?.data?.description}
              </span>
              <span>
                <strong>Resumo:&nbsp;</strong>
                {obj?.data?.resume}
              </span>
            </section>
          </section>
        </TimelineContainer>
      );
    case "occurrence":
      return (
        <TimelineContainer>
          <span className="inf-tag occurrence-tag">Ocorrência</span>
          <span className="inf-tag">
            {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")} às{" "}
            {moment(obj?.data?.realizedAt).format("HH:mm")}
          </span>

          <span className="inf-tag">{obj?.data?.creationUser?.name}</span>

          {allowEdit && (
            <Button
              onClick={() => {
                setOccurrenceVisible(true);
                setOccurrenceData({
                  id: obj?.meta?.occurrence,
                  occurrence: {
                    id: obj?.meta?.rootOcurrence,
                    type: "OC",
                    description: "Ocorrência",
                  },
                  executed_at: obj?.data?.realizedAt,
                  description: obj?.data?.description,
                  active: true,
                  previewed_at: obj?.data?.issuedAt,
                  resume: obj?.data?.resume,
                  user: {
                    name: obj?.data?.technician?.name,
                    id: obj?.data?.technician?.id,
                  },
                });
              }}
            >
              Editar
            </Button>
          )}

          <section className="">
            <p className="uk-margin-remove">
              <strong>
                Data da ocorrência:&nbsp;
                {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")}
              </strong>
            </p>
            <p className="uk-margin-remove">
              <strong>Resumo:&nbsp;</strong>
              {obj?.data?.resume}
            </p>
            <div className="uk-flex uk-flex-wrap uk-flex-middle uk-margin-remove">
              <p style={{ marginRight: "3px" }}>
                {" "}
                <strong>Descrição:&nbsp;</strong>
              </p>
              <p
                className="uk-margin-remove"
                dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
              ></p>
            </div>
          </section>
        </TimelineContainer>
      );
    case "weight_occurrence":
      return (
        <TimelineContainer>
          <span className="inf-tag weight-tag">Peso</span>
          <span className="inf-tag">
            {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")} às{" "}
            {moment(obj?.data?.realizedAt).format("HH:mm")}
          </span>

          <span className="inf-tag">{obj?.data?.creationUser?.name}</span>
          <div className="desc-box">
            <section className="">
              <span>
                <strong>Peso:&nbsp;</strong>
                {obj?.data?.resume}Kg
              </span>
              <span>
                <strong>Descrição:&nbsp;</strong>
              </span>
              <p
                dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
              ></p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "death_occurrence":
      return (
        <TimelineContainer>
          <span className="inf-tag death">Obito</span>
          <span className="inf-tag">
            {moment(obj?.data?.realizedAt).format("DD/MM/YYYY")} às{" "}
            {moment(obj?.data?.realizedAt).format("HH:mm")}
          </span>
          <span className="inf-tag">{obj?.data?.creationUser?.name}</span>
          <div className="desc-box">
            <section>
              <span>
                <strong>Data do óbito:</strong>&nbsp;
                {moment(obj?.data?.realizedAt).format("DD/MM/YYYY - HH:mm")}
              </span>

              <span>
                <strong>Relatório óbito:&nbsp;</strong>
              </span>
              <p
                dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
              ></p>
            </section>
          </div>
        </TimelineContainer>
      );
    case "scheduling_execution":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag medical-presc-exec">
              Execução prescrição
            </span>
            <span className="inf-tag">
              {moment(obj?.createdAt).format("DD/MM/YYYY")}
              &nbsp;às&nbsp;
              {moment(obj?.createdAt).format("HH:mm")}
            </span>
            <span className="inf-tag">{obj?.data?.technician?.name}</span>
          </div>
          <div className="desc-box">
            <section>
              <span>
                <strong>Tipo:&nbsp;</strong>
                {labelControl(obj?.data?.prescription_type)}
              </span>
              <span>
                <strong>Data execução:&nbsp;</strong>
                {moment(obj?.executedAt).format("DD/MM/YYYY - HH:mm")}
              </span>
            </section>
            <section>
              <span>
                <strong>Resumo:&nbsp;</strong> {obj?.data?.resume}
              </span>
              <span>
                <strong>Observação:&nbsp;</strong>
                {obj?.data?.description}
              </span>
            </section>
          </div>
        </TimelineContainer>
      );
    case "hospitalization_release":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag release-hospitalization">
              {" "}
              Alta Internação
            </span>
            <span className="inf-tag">
              {moment(obj?.createdAt).format("DD/MM/YYYY")}
              &nbsp;às&nbsp;
              {moment(obj?.createdAt).format("HH:mm")}
            </span>
            <span className="inf-tag">{obj?.data?.technician?.name}</span>
          </div>

          <div className="desc-box">
            <section>
              <span>
                <strong>Data da alta:&nbsp;</strong>
                {moment(obj?.data?.realizedAt).format("DD/MM/YYYY - HH:mm")}
              </span>
              <span>
                <strong>Tipo:&nbsp;</strong>
                {obj?.data?.releaseType}
              </span>
            </section>
            <section>
              <span>
                <strong>Relatório da alta:&nbsp;</strong>
                <div
                  dangerouslySetInnerHTML={{ __html: obj?.data?.description }}
                ></div>
              </span>
            </section>
          </div>
        </TimelineContainer>
      );

    case "hospitalization_completed":
      return (
        <TimelineContainer>
          <div>
            <span className="inf-tag">
              {moment(obj?.createdAt).format("DD/MM/YYYY")}
              &nbsp;às&nbsp;
              {moment(obj?.createdAt).format("HH:mm")}
            </span>

            <span className="inf-tag">Finalização da internação</span>
            <span className="inf-tag">{obj?.data?.technician?.name}</span>
          </div>
        </TimelineContainer>
      );
  }
};

function Timeline({ data, patientData, setReload, allowEdit }) {
  const [occurrenceVisible, setOccurrenceVisible] = useState(false);
  const [occurrenceData, setOccurrenceData] = useState({});

  const functions = {
    setOccurrenceVisible,
    setOccurrenceData,
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
}

export default Timeline;
