// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";

import { treatmentService } from "@/OLD/services/treatments.service";
import { calendarService } from "@/OLD/services/calendar.service";

import { useSchedulesByPatient } from "@/OLD/hooks/useSchedules";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import {
  Button,
  Modal,
  Input,
  notification,
  DatePicker,
  TimePicker,
  AutoComplete,
  Tooltip,
  Popconfirm,
} from "antd";
import { Container } from "./styles";

const { TextArea } = Input;

import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BiTrashAlt } from "react-icons/bi";

import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

export default function ExecutionForm({ data, reload, setReload }) {
  const [visible, setVisible] = useState(false);
  const [newScheduleVisible, setNewScheduleVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newIsVisible, setNewIsVisible] = useState(false);
  const [payload, setPayload] = useState({});
  const [search, setSearch] = useState("");
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [executionPayload, setExecutionPayload] = useState([]);
  const [selectedId, setSelectedId] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [reasonVisible, setReasonVisible] = useState(false);
  const [removePayload, setRemovePayload] = useState({});

  const { schedules } = useSchedulesByPatient(data?.treatment?.client?.id);
  const { colaborators } = useColaborators();
  const { user } = useProfile();

  const schedulingExecutionPermission = useUserHasPermission("TRA01");
  const submitExecutionPermission = useUserHasPermission("TRA02");
  const removeExecutionPermission = useUserHasPermission("TRA03");

  const getSchedule = (id) => {
    calendarService
      .showSchedule(id)
      .then((res) =>
        setSchedule({
          event: res.data,
          end: res.data.end_hour,
          start: res.data.start_hour,
          type: "schedule",
        })
      )
      .catch((err) => console.log(err))
      .finally(() => {
        setDetailsVisible(true);
      });
  };

  useEffect(() => {
    setAvailableSchedules(
      schedules.filter(
        (schedule) =>
          moment(schedule?.start_hour).format("DD/MM/YYYY") >=
          moment(new Date()).format("DD/MM/YYYY")
      )
    );
  }, [reload, schedules]);

  useEffect(() => {
    setExecutionPayload(
      data?.executions
        ?.map((exec) => {
          if (exec?.status !== "Cancelado" && exec?.status !== "Excluido") {
            return {
              ...exec,
              id: exec?.id,
              colabName: exec?.executionUser?.name,
              date: exec?.executionDate ? moment(exec?.executionDate) : "",
              hour: exec?.executionDate ? moment(exec?.executionDate) : "",
              observation: exec?.observations,
              executionUser: exec?.executionUser?.id,
            };
          }
        })
        .filter((item) => item)
    );
  }, [reload, JSON.stringify(data.executions)]);

  useEffect(() => {
    visible &&
      setQuantity(
        data?.treatmentItem?.quantity - data?.treatmentItem?.scheduledQuantity
      );
  }, [data]);

  const createExecution = useCallback(
    (schedule) => {
      setLoading(true);
      treatmentService
        .createExecution({
          treatmentId: data?.treatment?.id,
          treatmentItemId: data?.treatmentItem?.id,
          scheduleId: schedule?.id,
          scheduledQuantity: quantity,
          scheduleDate: moment(schedule?.start_hour).toISOString(),
        })
        .then((_res) => {
          setLoading(false);
          notification.success({ message: "Execução criada com sucesso!" });
          setVisible(false);
          setReload((prv) => !prv);
        })
        .catch((_err) => {
          setLoading(false);
          return notification.error({
            message: "Houve um problema ao criar a execução",
          });
        });
    },
    [JSON.stringify(data), quantity]
  );

  const submitExecution = useCallback(() => {
    setLoading(true);

    const execution = executionPayload.find((exec) => exec?.id === selectedId);

    treatmentService
      .completeExecution({
        executionId: execution?.id,
        treatmentItemId: execution?.item?.id,
        treatmentId: data?.treatment?.id,
        quantityExecuted: 1,
        quantity: execution?.quantityExecuted,
        executionDate: moment(execution?.date).toISOString(),
        observations: execution?.observation,
        executionUser: execution?.executionUser,
      })
      .then((_res) => {
        setReload((prv) => !prv);
        setLoading(false);
        setSelectedId(false);
        return notification.success({ message: "Item executado com sucesso!" });
      })
      .catch((_err) => setLoading(false));
  }, [executionPayload, selectedId, data]);

  const removeExecution = useCallback(() => {
    setLoading(true);
    treatmentService
      .removeExecution(removePayload)
      .then((_res) => {
        setLoading(false);
        setReasonVisible(false);
        setReload(!reload);
        return notification.success({
          message: "Execução removida com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao remover a execução...",
        });
      });
  }, [JSON.stringify(removePayload)]);

  return (
    <Container>
      {data?.executions?.length === 0 ? (
        <span className="uk-text-muted">Nenhuma execução agendada</span>
      ) : (
        <div>
          {executionPayload.map((execution, i) => (
            <div className="uk-margin-small-top">
              <div className="uk-flex uk-flex-around">
                <div>
                  <label>Item Execução</label>
                  <br />
                  {execution?.productivityItem?.description || "-"}
                </div>
                <div className="">
                  <label>Data agendamento</label>
                  <br />
                  <Tooltip title="Clique para acessar os detalhes do agendamento">
                    <span
                      className="uk-link"
                      onClick={() => getSchedule(execution?.schedule?.id)}
                    >
                      {execution?.scheduleDate
                        ? moment(
                            execution?.scheduleDate,
                            "YYYY-MM-DD[T]HH:mm:ss"
                          ).format("DD/MM/YYYY - HH:mm")
                        : "-"}
                    </span>
                  </Tooltip>
                </div>
                <div className="uk-margin-small-right">
                  <label>Profissional Responsável</label>
                  <AutoComplete
                    disabled={!(execution?.id === selectedId)}
                    className="uk-width-1-1"
                    options={colaborators.map((colab) => ({
                      ...colab,
                      value: colab?.name,
                    }))}
                    value={
                      executionPayload.find((pay) => pay?.id === execution?.id)
                        ?.colabName
                    }
                    onChange={(val) => {
                      const obj = [...executionPayload];
                      obj.splice(i, 1, {
                        ...executionPayload[i],
                        colabName: val,
                      });
                      setExecutionPayload(obj);
                    }}
                    onSelect={(_, opt) => {
                      const obj = [...executionPayload];
                      obj.splice(i, 1, {
                        ...executionPayload[i],
                        colabName: opt?.value,
                        executionUser: opt?.id,
                      });
                      setExecutionPayload(obj);
                    }}
                    filterOption={(val, opt) =>
                      normalizeStr(opt?.value.toUpperCase()).includes(
                        normalizeStr(val.toUpperCase())
                      )
                    }
                  />
                </div>
                <div className="uk-margin-small-right">
                  <label>Data Execução</label>
                  <DatePicker
                    disabled={!(execution?.id === selectedId)}
                    format="DD/MM/YYYY - HH:mm"
                    showTime
                    value={
                      executionPayload.find((pay) => pay?.id === execution?.id)
                        ?.date
                    }
                    onChange={(val) => {
                      const obj = [...executionPayload];
                      obj.splice(i, 1, {
                        ...executionPayload[i],
                        date: val,
                      });
                      setExecutionPayload(obj);
                    }}
                    className="uk-width-1-1"
                  />
                </div>
                {execution?.scheduleDate && (
                  <div className={`uk-margin-small-left uk-flex`}>
                    {submitExecutionPermission && (
                      <HiOutlinePencilAlt
                        className={`pointer-icon ${
                          selectedId === execution?.id
                            ? "inactive-icon"
                            : "active-edit-icon"
                        }`}
                        size={25}
                        onClick={() => {
                          if (!execution?.executionUser) {
                            setSelectedId(execution?.id);
                            const obj = [...executionPayload];
                            obj.splice(i, 1, {
                              ...executionPayload[i],
                              colabName: user?.name,
                              executionUser: user?.id,
                              date: moment(new Date()),
                              quantityExecuted: execution?.scheduledQuantity,
                            });
                            setExecutionPayload(obj);
                          } else {
                            return notification.warning({
                              message: "Execução já efetuada",
                            });
                          }
                        }}
                      />
                    )}
                    <AiOutlineCheckCircle
                      className={`pointer-icon ${
                        selectedId === execution?.id
                          ? "confirm-icon"
                          : "inactive-icon"
                      }`}
                      size={25}
                      onClick={() => {
                        if (selectedId === execution?.id) {
                          submitExecution();
                        }
                      }}
                    />
                    <ImCancelCircle
                      className={`pointer-icon ${
                        selectedId === execution?.id
                          ? "cancel-icon"
                          : "inactive-icon"
                      }`}
                      size={23}
                      onClick={() => {
                        if (selectedId === execution?.id) {
                          setSelectedId(false);
                          setReload((prv) => !prv);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="uk-margin-small-top">
                <label>Observação</label>
                <TextArea
                  disabled={!(execution?.id === selectedId)}
                  value={
                    executionPayload.find((pay) => pay?.id === execution?.id)
                      ?.observation
                  }
                  onChange={(e) => {
                    const obj = [...executionPayload];
                    obj.splice(i, 1, {
                      ...executionPayload[i],
                      observation: e.target.value,
                    });
                    setExecutionPayload(obj);
                  }}
                />
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
      <Modal
        visible={visible}
        title={`Agendar Execução - ${data?.treatmentItem?.productVariation?.description}`}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <section>
          <div>
            <label>Qtd.: Execução</label>
            <Input
              value={quantity}
              onChange={(e) => {
                const max =
                  data?.treatmentItem?.quantity -
                  data?.treatmentItem?.scheduledQuantity;

                if (e.target.value > max) {
                  return notification.warning({
                    message:
                      "O valor não deve ultrapassar a quantidade máxima disponível para agendamento",
                  });
                }
                setQuantity(e.target.value);
              }}
            />
          </div>
          <h5 className="uk-heading-line">
            <span>Agendamentos já existentes</span>
          </h5>
          {availableSchedules?.length > 0 ? (
            <section>
              <div className="uk-flex">
                <div className="uk-width-1-2"> Data agendamento</div>
                <div className="uk-width-1-2"> Serviço agendado</div>
              </div>
              {availableSchedules.map((schedule) => (
                <div className="uk-flex uk-margin-small-top">
                  <div className="uk-width-1-2">
                    {moment(
                      schedule.start_hour,
                      "YYYY-MM-DD[T]HH:mm:ss"
                    ).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div>
                    <span
                      className="uk-link"
                      onClick={() => createExecution(schedule)}
                    >
                      {schedule?.serviceType?.description}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <span className="uk-text-muted">Nenhum agendamento disponível</span>
          )}
        </section>
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button
            type="primary"
            className="uk-margin-right"
            onClick={() => {
              setPayload({
                tutor_id: data?.tutor?.id,
                tutorName: data?.tutor?.name,
                patientName: data?.patient?.name,
                patient_id: data?.patient?.id,
              });
              setNewScheduleVisible(true);
            }}
          >
            Criar novo agendamento
          </Button>
          <Button onClick={() => setVisible(false)}>Cancelar</Button>
        </footer>
      </Modal>
      {/* <DrawerNewSchedule
        isOpen={newScheduleVisible}
        setIsOpen={setNewScheduleVisible}
        setNewIsOpen={setNewIsVisible}
        refreshData={() => setReload((prv) => !prv)}
        payload={payload}
        setPayload={setPayload}
        search={search}
        setSearch={setSearch}
        createTreatment={createExecution}
      />
      <ScheduleDetails
        visible={detailsVisible}
        setVisible={setDetailsVisible}
        reload={reload}
        setReload={setReload}
        item={schedule}
      /> */}
      <Modal
        visible={reasonVisible}
        title="Motivo do cancelamento"
        onOk={() => removeExecution()}
        onCancel={() => {
          setReasonVisible(false);
        }}
      >
        <div>
          <label>Motivo do cancelamento</label>
          <TextArea
            value={removePayload?.reason}
            onChange={(e) =>
              setRemovePayload({ ...removePayload, reason: e.target.value })
            }
          />
        </div>
      </Modal>
    </Container>
  );
}
