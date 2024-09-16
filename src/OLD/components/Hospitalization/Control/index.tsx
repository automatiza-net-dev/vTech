// @ts-nocheck
import {
  Collapse,
  Divider,
  Modal,
  Skeleton,
  notification,
  Popconfirm,
  Select,
  Tooltip,
} from "antd";
const { Option } = Select;
import { memo, useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { hospitalizationService } from "@/OLD/services/hospitalization.service";

import { Button } from "infinity-forge";
import moment from "moment";
import "moment/locale/pt-br";
import Link from "next/link";
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";
import styled from "styled-components";
// import { BackgroundColor } from "styled-icons/foundation";

import { BiDuplicate } from "react-icons/bi";

const $Container = styled.div`
  .ant-collapse-header {
    width: 100%;
  }

  .ant-collapse-content {
    width: 100%;
  }

  .ant-collapse-content-box {
    width: 100%;
  }
`;

const parseLabel = (label) => {
  if (!label) {
    return "-";
  }

  if (label === "FLUID_THERAPY") {
    return "Fluidoterapia";
  }

  if (label === "MEDICATION") {
    return "Medicação";
  }

  return "Procedimento";
};

const convertToAge = (age) => {
  if (!age) {
    return "-";
  }

  const totalDays = age * 365;

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = Math.floor(totalDays - years * 365 - months * 30);

  return `${years} anos, ${months} meses e ${days} dias`;
};

const parseWeight = (weight = null, date = null) => {
  if (!weight) {
    return "-";
  }

  return `${weight}kg em ${moment(date).format("DD/MM/YYYY")}`;
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

const HospitalizationControl = memo(function HospitalizationControl({
  id = null,
  close,
  origin = "hospitalization",
  visible = false,
}) {
  const [status, setStatus] = useState("Aberto");

  const interruptMedicalPrescriptionPermission = useUserHasPermission("INT04");
  const cancelMedicalPrescriptionPermission = useUserHasPermission("INT05");

  const controlQuery = useQuery({
    queryKey: ["hospitalization-control", id, status],
    queryFn: async () => {
      return await hospitalizationService
        .hospitalizationInfo(id)
        .then((res) => {
          if (status === "all") {
            return res.data;
          } else {
            const prescriptions = res.data.prescriptions.filter(
              (item) => item?.status === status
            );
            const filteredData = { ...res.data, prescriptions };
            return filteredData;
          }
        });
    },
    enabled: Boolean(id),
  });

  const interruptMutation = useMutation(
    (pid) => hospitalizationPrescriptionsService.interruptPrescription(pid),
    {
      onSuccess: () => {
        controlQuery.refetch();
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao interromper",
        });
      },
    }
  );

  const excludeMutation = useMutation(
    (pid) => hospitalizationPrescriptionsService.excludePrescription(pid),
    {
      onSuccess: () => {
        controlQuery.refetch();
      },
      onError: (err) => {
        notification.error({
          message: err.response.data.message
            ? err.response.data.message.split(":").at(1)
            : "Erro ao excluir",
        });
      },
    }
  );

  const formatDate = useCallback((date) => {
    if (!date) {
      return "-";
    }

    return moment(date).format("DD/MM/YYYY HH:mm");
  }, []);

  return (
    <Modal
      title="Controle - Prescrições Médicas"
      visible={origin === "hospitalization" ? Boolean(id) : visible}
      onOk={close}
      onCancel={close}
      width={1200}
    >
      {controlQuery.isLoading && <Skeleton paragraph={{ rows: 4 }} />}

      {controlQuery.data && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>Tipo: {controlQuery.data.type}</p>
            </div>
            <div>
              <p>Data internação: {formatDate(controlQuery.data.createdAt)}</p>
            </div>
            <div>
              <p>
                Data previsão alta:{" "}
                {formatDate(controlQuery.data.expectedDischarge)}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>
                {[
                  `Paciente: ${controlQuery.data.patient.name}`,
                  `RG: ${controlQuery.data.patient.tag ?? "-"}`,
                ].join(" | ")}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <span>Espécie: {controlQuery.data.patient.info.specie}</span>
              <span>Raça: {controlQuery.data.patient.info.race}</span>
              <span>
                Idade: {convertToAge(controlQuery.data.patient.info.age)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <span>Pelagem: {controlQuery.data.patient.info.hair}</span>
              <span>
                Peso:{" "}
                {parseWeight(
                  controlQuery.data.patient.info.weight,
                  controlQuery.data.patient.info.weightDate
                )}
              </span>
            </div>
          </div>

          <Divider />

          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              paddingTop: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "space-between",
              }}
            >
              <span>Tutor: {controlQuery.data.tutor.name}</span>
              <span>Telefone: {controlQuery.data.tutor.telephone}</span>
              <span>Celular: {controlQuery.data.tutor.cellphone}</span>
            </div>
            <div className="uk-flex uk-width-1-3 uk-flex-between">
              <div className="uk-width-1-2">
                <label>Status</label>
                <br />
                <Select
                  className="uk-width-1-1"
                  value={status}
                  onChange={(val) => {
                    setStatus(val);
                  }}
                >
                  <Option value="all">Todos</Option>
                  <Option value="Aberto">Em aberto</Option>
                  <Option value="Executado">Executado</Option>
                  <Option value="Cancelado">Cancelado</Option>
                  <Option value="Interrompido">Interrompido</Option>
                </Select>
              </div>
              {origin === "hospitalization" && (
                <Link href={`/dashboard/internacao/prescricao/${id}`}>
                  <div className="uk-margin-top">
                    <Button type="link" size="small" text="Nova prescrição" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          <$Container>
            <Collapse
              style={{
                marginTop: "2rem",
              }}
            >
              {controlQuery.data.prescriptions.map((prescription) => (
                <Collapse.Panel
                  key={prescription.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-between",
                    backgroundColor:
                      prescription.status === "A" ? "#EDFFED" : "",
                  }}
                  className="uk-width-1-1"
                  header={
                    <div
                      className="uk-flex"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 2fr 1fr",
                        width: "100%",
                        minWidth: "1150px",
                        fontSize: "1.2rem",
                        rowGap: "0.5rem",
                      }}
                    >
                      <div>
                        <span>Tipo: {parseLabel(prescription.type)}</span>
                      </div>
                      <div>
                        {prescription?.frequency !== "WHEN_NEEDED" && (
                          <span>
                            Início:{" "}
                            {moment(prescription.execution_start).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </span>
                        )}
                      </div>

                      <div>
                        {prescription?.frequency === "RECURRENT" ? (
                          <span>
                            Frequência:{" "}
                            {[
                              "A cada",
                              `${
                                prescription.frequency_interval
                              } ${parseInterval(
                                prescription.frequency_unit,
                                prescription.frequency_interval
                              )}`,
                              "por",
                              `${
                                prescription.frequency_quantity
                              } ${parseInterval(
                                prescription.frequency_quantity_unit,
                                prescription.frequency_quantity
                              )}`,
                            ].join(" ")}
                          </span>
                        ) : (
                          <span>
                            Frequência:{" "}
                            {prescription?.frequency === "WHEN_NEEDED"
                              ? "Quando necessário"
                              : "Apenas uma vez"}
                          </span>
                        )}
                      </div>

                      <div className="uk-flex">
                        <div className="uk-margin-right">
                          <span>Status: {prescription?.status}</span>
                        </div>
                        {origin === "hospitalization" && (
                          <div>
                            <Link
                              href={`/dashboard/internacao/prescricao-duplicar/${id}/${prescription?.id}`}
                            >
                              <Tooltip title="Duplicar Prescrição">
                                <BiDuplicate
                                  color="var(--darkBlue)"
                                  size={15}
                                  style={{ cursor: "pointer" }}
                                />
                              </Tooltip>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          gridColumnStart: "1",
                          gridColumnEnd: "5",
                        }}
                      >
                        <span>
                          Resumo: {prescription.scheduling?.at(0)?.resume}
                        </span>
                      </div>
                    </div>
                  }
                >
                  <div
                    className="uk-width-1-1"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    {!prescription.excluded_at && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          gap: "1rem",
                        }}
                      >
                        {interruptMedicalPrescriptionPermission &&
                          origin === "hospitalization" && (
                            <Popconfirm
                              title="Deseja realmente interromper a prescrição?"
                              onConfirm={() => {
                                interruptMutation.mutate(prescription.id);
                              }}
                              okText="Sim"
                              cancelText="Não"
                            >
                              <Button
                                text="Interromper"
                                disabled={
                                  prescription.excluded_at ||
                                  interruptMutation.isLoading
                                }
                              />
                            </Popconfirm>
                          )}
                        {cancelMedicalPrescriptionPermission &&
                          origin === "hospitalization" && (
                            <Popconfirm
                              title="Deseja realmente canceclar a prescrição?"
                              onConfirm={() => {
                                excludeMutation.mutate(prescription.id);
                              }}
                              okText="Sim"
                              cancelText="Não"
                            >
                              <Button
                                text="Cancelar"
                                disabled={
                                  prescription.excluded_at ||
                                  excludeMutation.isLoading
                                }
                              />
                            </Popconfirm>
                          )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {prescription.scheduling?.map((elem, index) => (
                        <div id={elem.id}>
                          <div
                            style={{
                              width: "100%",
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 1fr",
                              rowGap: "0.25rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                              }}
                            >
                              {index === 0 && <span>Data Agendamento</span>}
                              <span>{formatDate(elem.scheduled_at)}</span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {index === 0 && <span>Data Execução</span>}

                              <span>
                                {elem.executed_at
                                  ? formatDate(elem.executed_at)
                                  : "-"}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {index === 0 && <span>Usuário Execução</span>}

                              <span>{elem.executionUser?.name ?? "-"}</span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {index === 0 && (
                                <span>Observação da Execução</span>
                              )}
                              <span>{elem.description ?? "-"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Collapse.Panel>
              ))}
            </Collapse>
          </$Container>
        </div>
      )}
    </Modal>
  );
});

export default HospitalizationControl;
