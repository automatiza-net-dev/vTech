// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";

// Services
import { clinicService } from "@/OLD/services/clinic.service";
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";

// Icons
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { HiOutlinePencilAlt } from "react-icons/hi";

// Utils
import moment from "moment";

// Components;
import { Container } from "./styles";
import {
  Modal,
  DatePicker,
  Input,
  TimePicker,
  Button,
  notification,
  Select,
} from "antd";
const { TextArea } = Input;
const { Option } = Select;

export const typeLabel = (str) => {
  if (str === "MEDICATION") {
    return "Medicação";
  }
  if (str === "PROCEDURE") {
    return "Procedimento";
  }
  if (str === "FLUID_THERAPY") {
    return "Fluidoterapia";
  }
};

const ByPatient = memo(function ByPatient({
  visible,
  setVisible,
  patientData,
  selectedDate,
  reload,
  setReload,
}) {
  const [medicalPrescriptions, setMedicalPrescriptions] = useState([]);
  const [allVets, setAllVets] = useState([]);
  const [data, setData] = useState({});
  const [timeData, setTimeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { patient } = patientData;

  const getVets = useCallback(() => {
    setLoading(true);
    clinicService
      .getColaborators({})
      .then((res) =>
        setAllVets(
          res.data.map((item) => {
            return {
              value: item?.name,
              id: item?.id,
            };
          })
        )
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Não foi possível buscar os veterinários disponíveis.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getVets();

    let arr = [];

    const mp = patientData?.medicalP?.map((item) =>
      item?.scheduling.map((schedule) => {
        return {
          ...schedule,
          description: item?.resume,
          selectedDate: schedule?.executed_at
            ? moment(schedule?.executed_at)
            : "",
          selectedHour: schedule?.executed_at
            ? moment(schedule?.executed_at)
            : "",
        };
      })
    );

    mp?.map((item) => {
      arr.push(...item);
    });

    setMedicalPrescriptions(
      arr
        .filter(
          (item) =>
            moment(item?.scheduled_at).format("DD/MM/YYYY") === selectedDate
        )
        .sort((a, b) => moment(a.scheduled_at).diff(moment(b.scheduled_at)))
    );
  }, [patientData, selectedDate, getVets, reload]);

  const handleSubmit = useCallback(() => {
    setLoading(true);

    hospitalizationPrescriptionsService
      .updateScheduling(medicalPrescriptions[selectedIndex]?.id, {
        type: medicalPrescriptions[selectedIndex]?.type,
        frequency: medicalPrescriptions[selectedIndex]?.frequency,
        scheduledAt: medicalPrescriptions[selectedIndex]?.scheduled_at,
        executedAt: moment(medicalPrescriptions[selectedIndex]?.selectedDate)
          .hours(
            parseInt(
              moment(medicalPrescriptions[selectedIndex]?.selectedHour).format(
                "HH:mm:ss"
              )
            )
          )
          .toISOString(),
        prescribedAt: medicalPrescriptions[selectedIndex]?.prescribed_at,
        description: medicalPrescriptions[selectedIndex]?.description,
        resume: medicalPrescriptions[selectedIndex]?.resume,
        status: "Executado",
        executionUserId: data?.executionUserId,
      })
      .then((_res) =>
        notification.success({ message: "Prescrição executada com sucesso!" })
      )
      .catch((_err) =>
        notification.error({
          message: "houve um erro ao executar a prescrição...",
        })
      )
      .finally(() => {
        setReload(!reload);
        setVisible(false);
        setData({});
        setLoading(false);
      });
  }, [medicalPrescriptions, selectedIndex]);

  return (
    <Modal
      title={`Prescrições médicas - Paciente: ${patient?.name}`}
      visible={visible}
      onCancel={() => setVisible(false)}
      width={900}
      footer={null}
    >
      <Container>
        {medicalPrescriptions?.length > 0 ? (
          medicalPrescriptions.map((item, index) => {
            return (
              <>
                <section className="uk-margin-top">
                  <div>
                    <div className="uk-text-bold">
                      {moment(item?.scheduled_at).format("DD/MM/YYYY - HH:mm")}h
                      &nbsp;-&nbsp;
                      {typeLabel(item?.type)}
                    </div>
                    <div>{item?.resume}</div>
                    <div>{item?.description}</div>
                  </div>
                  <section className="uk-flex uk-flex-between uk-margin-small-top">
                    <div className="uk-width-3-4 uk-margin-small-right">
                      <label>Usuário da execução</label>
                      <br />
                      <Select
                        disabled={!(selectedIndex === index)}
                        className="uk-width-1-1"
                        onChange={(e) => {
                          const arr = [...medicalPrescriptions];
                          arr.splice(index, 1, {
                            ...medicalPrescriptions[index],
                            executionUserId: e,
                          });
                          setMedicalPrescriptions(arr);
                          setData({ ...data, executionUserId: e });
                        }}
                        value={
                          !(selectedIndex === index)
                            ? medicalPrescriptions[index]?.user?.id
                            : data?.executionUserId
                        }
                      >
                        {allVets.length > 0 &&
                          allVets.map((vet, i) => (
                            <Option key={i} value={vet?.id}>
                              {vet?.value}
                            </Option>
                          ))}
                      </Select>
                    </div>
                    <div className="uk-margin-small-right">
                      <label>Data execução</label>
                      <DatePicker
                        format="DD/MM/YYYY HH:mm"
                        showTime
                        value={
                          !(selectedIndex === index)
                            ? medicalPrescriptions[index]?.selectedDate
                            : data?.selectedDate
                        }
                        disabled={!(selectedIndex === index)}
                        onChange={(e) => {
                          const arr = [...medicalPrescriptions];
                          arr.splice(index, 1, {
                            ...medicalPrescriptions[index],
                            selectedDate: e,
                          });
                          setMedicalPrescriptions(arr);
                          setData({ ...data, selectedDate: e });
                        }}
                      />
                    </div>
                    <div className={`uk-margin-top uk-margin-left uk-flex`}>
                      <HiOutlinePencilAlt
                        className="active-edit-icon edit-icon"
                        size={40}
                        onClick={() => {
                          if (!item?.executed_at) {
                            setSelectedIndex(index);
                          } else {
                            return notification.error({
                              message: "Prescrição já executada",
                            });
                          }
                        }}
                      />
                      <AiOutlineCheckCircle
                        onClick={() => {
                          if (!item?.executed_at) {
                            handleSubmit();
                            setData({});
                            setSelectedIndex("");
                          }
                        }}
                        size={40}
                        className={`edit-icon ${
                          selectedIndex === index
                            ? "confirm-icon"
                            : "inactive-icon"
                        }`}
                      />
                      <ImCancelCircle
                        className={`edit-icon ${
                          selectedIndex === index
                            ? "cancel-icon"
                            : "inactive-icon"
                        }`}
                        size={35}
                        onClick={() => {
                          setSelectedIndex(false);
                          setData({});
                        }}
                      />
                    </div>
                  </section>
                </section>
                <div className="uk-margin-small-top">
                  <label>Observação</label>
                  <TextArea
                    disabled={!(selectedIndex === index)}
                    onChange={(e) => {
                      const arr = [...medicalPrescriptions];
                      arr.splice(index, 1, {
                        ...medicalPrescriptions[index],
                        description: e.target.value,
                      });
                      setMedicalPrescriptions(arr);
                      setData({ ...data, description: e.target.value });
                    }}
                    value={
                      !(selectedIndex === index)
                        ? medicalPrescriptions[index]?.description
                        : data?.description
                    }
                  />
                </div>
              </>
            );
          })
        ) : (
          <>Nenhum procedimento agendado para o dia selecionado</>
        )}
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button type="primary" onClick={() => setVisible(false)}>
            Concluir
          </Button>
        </footer>
      </Container>
    </Modal>
  );
});

export default ByPatient;
