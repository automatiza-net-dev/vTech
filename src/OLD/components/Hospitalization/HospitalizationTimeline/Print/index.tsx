// @ts-nocheck
import { useProfile } from "@/OLD/hooks/useProfile";

import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";
import PatientHeader from "@/OLD/components/mini-components/Print/PetHeader";
import { Container } from "./styles";

import moment from "moment";

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

const PrintContent = ({ obj, patient }) => {
  const { clinic } = useProfile();

  return (
    <Container>
      <div className="uk-text-center uk-margin-top">
        <PrintHeader unit={clinic} />
        <PatientHeader
          patient={{ ...patient?.patient, tutorData: { ...patient?.tutor } }}
        />
      </div>
      {obj.map((item) => {
        return (
          <div>
            {item?.meta?.type === "begin_hospitalization" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    {item?.data?.type} {" - "} {item?.data?.technician?.name}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Previsão Alta:{" "}
                      {moment(item?.data?.expectedDischarge).format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                    </p>
                    <p className="uk-margin-remove">
                      Gravidade: {item?.data?.risk}
                    </p>
                    <p className="uk-margin-remove">
                      Queixa: {item?.data?.complaint}
                    </p>
                    <p className="uk-margin-remove">
                      Diagnóstico: {item?.data?.diagnosis}
                    </p>
                    <p className="uk-margin-remove">
                      Proagnóstico: {item?.data?.prognosis}
                    </p>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "report_occurrence" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    {item?.data?.type} {" - "} {item?.data?.technician?.name}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Resumo: {item?.data?.resume}
                    </p>
                    <div className="uk-flex uk-flex-wrap uk-flex-middle uk-margin-remove">
                      <p style={{ marginRight: "3px" }}> Descrição: </p>
                      <p
                        className="uk-margin-remove"
                        dangerouslySetInnerHTML={{
                          __html: item?.data?.description,
                        }}
                      ></p>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "hospitalization_completed" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    Internação Finalizada
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Profissional responsável: {item?.data?.technician?.name}
                    </p>
                    <p className="uk-margin-remove">
                      Tutor responsável: {item?.data?.tutor?.name}
                    </p>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "prescription" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove uk-flex">
                    Prescrição médica{" - "}
                    {item?.data?.technician?.name}{" "}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Descrição: {item?.data?.description}
                    </p>
                    <p className="uk-margin-remove">
                      Resumo: {item?.data?.resume}
                    </p>
                    <p className="uk-margin-remove">
                      Inicio execução:{" "}
                      {moment(item?.data?.executionStart).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </p>
                    <span>
                      Frequência:{" "}
                      {[
                        "A cada",
                        `${item?.data?.frequency_interval} ${parseInterval(
                          item?.data?.frequencyUnit,
                          item?.data?.frequency_interval
                        )}`,
                        "por",
                        `${item?.data?.frequency_quantity} ${parseInterval(
                          item?.data?.frequencyQuantityUnit,
                          item?.data?.frequency_quantity
                        )}`,
                      ].join(" ")}
                    </span>
                    <p className="uk-margin-remove">
                      Tipo: {item?.data?.prescription_type}
                    </p>
                    <p className="uk-margin-remove">
                      Recorrência: {labelControl(item?.data?.frequency)}
                    </p>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "occurrence" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    Ocorrência - {item?.data?.technician?.name}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Resumo: {item?.data?.resume}
                    </p>
                    <div className="uk-flex" style={{ marginBottom: "0px" }}>
                      <p style={{ marginRight: "3px" }}> Descrição: </p>
                      <p
                        className="uk-margin-remove"
                        dangerouslySetInnerHTML={{
                          __html: item?.data?.description,
                        }}
                      ></p>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "weight_occurrence" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    Registro de peso - {item?.data?.technician?.name}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Peso: {item?.data?.resume}
                    </p>
                    <div className="uk-flex uk-flex-wrap uk-flex-middle">
                      <p style={{ marginRight: "3px" }}>Descrição:</p>

                      <p
                        className="uk-margin-remove"
                        dangerouslySetInnerHTML={{
                          __html: item?.data?.description,
                        }}
                      ></p>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "death_occurrence" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="death-title uk-margin-remove">Óbito</h4>
                  <section className="">
                    <p className="uk-margin-remove">
                      Profissional responsável: {item?.data?.technician?.name}
                    </p>
                  </section>
                </div>
              </div>
            )}

            {item?.meta?.origin === "scheduling_execution" && (
              <div className="uk-flex uk-margin-top">
                <div className="uk-width-1-5">
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                  <br />
                  {moment(item?.createdAt).format("HH:mm")}
                </div>
                <div className="uk-width-1-1">
                  <h4 className="type-title uk-margin-remove">
                    Execução prescrição {" - "}
                    {item?.data?.technician?.name}
                  </h4>
                  <section className="">
                    <p className="uk-margin-remove">Tipo: {item?.data?.type}</p>
                    <p className="uk-margin-remove">
                      Data execução:{" "}
                      {moment(item?.executedAt).format("DD/MM/YYYY - HH:mm")}
                    </p>
                    <p className="uk-margin-remove">
                      Resumo: {item?.data?.resume}
                    </p>
                    <p className="uk-margin-remove">
                      Profissional responsável: {item?.data?.technician?.name}
                    </p>
                    <p className="uk-margin-remove">
                      Medicamento: {item?.data?.prescription}
                    </p>
                    <p className="uk-margin-remove">
                      Tipo: {labelControl(item?.data?.prescription_type)}
                    </p>
                  </section>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Container>
  );
};

export default PrintContent;
