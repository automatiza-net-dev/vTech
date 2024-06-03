// @ts-nocheck
// Core
import React, { useState, memo, useEffect, useCallback } from "react";

// Services
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";
import { clinicService } from "@/OLD/services/clinic.service";

// Hooks
import { useWorkerSchedule } from "@/OLD/hooks/useWorkerSchedule";

// Utils
import moment from "moment";
import { typeLabel } from "../ByPatient";

// Icons
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { HiOutlinePencilAlt } from "react-icons/hi";

// Components
import { Container } from "./styles";
import {
  Modal,
  DatePicker,
  TimePicker,
  notification,
  AutoComplete,
  Button,
  Select,
  Input,
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

const ByHour = memo(function ByHour({
  visible,
  setVisible,
  patientData,
  selectedHour,
  selectedDate,
  reload,
  setReload,
  type,
  medicalPrescription = false,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [data, setData] = useState({});
  const [allMedicalPrescriptions, setAllMedicalPrescriptions] = useState([]);
  const [availableUserFilters, setAvailableUserFilters] = useState({});

  const { workerSchedule } = useWorkerSchedule(availableUserFilters);

  useEffect(() => {
    setAvailableUserFilters({
      from: moment(data?.selectedDate).startOf("day").format("YYYY-MM-DD"),
      to: moment(data?.selectedDate).endOf("day").format("YYYY-MM-DD"),
    });
  }, []);

  const getAllHospitalizationPrescription = useCallback(() => {
    setLoading(true);
    hospitalizationPrescriptionsService
      .getAllMedicalPrescriptionSchedulling({
        from: moment(selectedDate, "DD/MM/YYYY")
          .hours(parseInt(moment(selectedHour, "HH").format("HH")))
          .toISOString(),
        to: moment(selectedDate, "DD/MM/YYYY")
          .hours(parseInt(moment(selectedHour, "HH").format("HH")))
          .add(1, "hour")
          .toISOString(),
      })
      .then((res) => {
        setAllMedicalPrescriptions(
          res.data
            .filter(
              (item) =>
                item?.frequency === "RECURRENT" || item?.frequency === "ONCE"
            )
            .sort((a, b) => moment(a.scheduled_at).diff(moment(b.scheduled_at)))
        );
      })
      .catch((_err) => {
        return notification.error({
          message:
            "Houve um erro ao buscar as prescrições para a data selecionada",
        });
      });
  }, [selectedDate, selectedHour]);

  useEffect(() => {
    visible && type === "hour" && getAllHospitalizationPrescription();
    visible &&
      type === "single" &&
      setAllMedicalPrescriptions([
        {
          ...medicalPrescription?.selectedSchedule,
          hospitalization:
            medicalPrescription?.selectedSchedule?.hospitalization,
        },
      ]);
  }, [getAllHospitalizationPrescription, reload, type, medicalPrescription]);

  const handleSubmit = useCallback(
    (medicalSelected) => {
      setLoading(true);
      hospitalizationPrescriptionsService
        .updateScheduling(medicalSelected?.id, {
          executedAt: moment(medicalSelected?.selectedDate)
            .hours(parseInt(moment(medicalSelected?.selectedHour).format("HH")))
            .toISOString(),
          executionUserId: medicalSelected?.executionUserId,
          hospitalizationId: medicalSelected?.hospitalization.id,
          type: medicalSelected?.type,
          executionStart: medicalSelected?.execution_start,
          frequency: medicalSelected?.frequency,
          description:
            data?.observationOnExecution ?? medicalSelected?.description,
          resume: medicalSelected?.resume,
          prescribedAt: medicalSelected?.prescribed_at,
          prescriptionUnitId: medicalSelected?.prescriptionUnit?.id,
          dose: medicalSelected?.dose,
          drugAdministrationId: medicalSelected?.drugAdministration?.id,
          frequencyInterval: medicalSelected?.frequency_interval,
          frequencyUnit: medicalSelected?.frequency_unit,
          frequencyQuantity: medicalSelected?.frequency_quantity,
          frequencyQuantityUnit: medicalSelected?.frequency_quantity_unit,
          status: "Executado",
        })
        .then(() =>
          notification.success({
            message: "Prescrição executada com sucesso!",
          })
        )
        .catch((err) => {
          setLoading(false);
          return notification.error({
            message: "Houve um erro ao lançar a execução da prescrição",
          });
        })
        .finally(() => {
          setData({});
          setLoading(false);
          setReload(!reload);
        });
    },
    [data]
  );

  const renderTitle = (type) => {
    if (type === "hour") {
      return `Prescrições médicas - Horário: ${selectedHour}`;
    }
    if (type === "single") {
      return `Execução prescrição médica`;
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={900}
      title={renderTitle(type)}
    >
      <Container>
        {allMedicalPrescriptions?.length > 0 ? (
          allMedicalPrescriptions?.map((medicalPrescription, index) => {
            const { patient } = medicalPrescription.hospitalization;
            return (
              <>
                <section>
                  <span className="uk-text-large"> {patient?.name} </span>{" "}
                  <br />
                  <span className="uk-text-bold">
                    {medicalPrescription?.scheduled_at &&
                      `${moment(medicalPrescription?.scheduled_at).format(
                        "DD/MM/YYYY - HH:mm"
                      )}h`}
                    {medicalPrescription?.frequency === "WHEN_NEEDED" &&
                      "Quando necessário"}
                    -{typeLabel(medicalPrescription.type)}
                  </span>
                  <p className="uk-margin-remove">
                    {medicalPrescription?.resume}
                  </p>
                  <span className="">
                    {medicalPrescription?.prescription?.resume}
                  </span>
                </section>
                <section className="uk-flex uk-margin-small-top">
                  <div className="uk-width-3-4 uk-margin-small-right">
                    <label>Usuário da execução</label>
                    <br />
                    <Select
                      disabled={!(selectedIndex === index)}
                      className="uk-width-1-1"
                      value={
                        !(selectedIndex === index)
                          ? allMedicalPrescriptions[index]?.executionUser?.id
                          : data?.executionUserId
                      }
                      onChange={(e) => {
                        const arr = [...allMedicalPrescriptions];
                        arr.splice(index, 1, {
                          ...allMedicalPrescriptions[index],
                          executionUserId: e,
                        });
                        setAllMedicalPrescriptions(arr);
                        setData({ ...data, executionUserId: e });
                      }}
                    >
                      {workerSchedule.length > 0 &&
                        workerSchedule
                          ?.filter(
                            (user) => user?.events?.length > 0 || user?.onDuty
                          )
                          .map((vet, i) => (
                            <Option key={i} value={vet?.id}>
                              {vet?.name}
                            </Option>
                          ))}
                    </Select>
                  </div>
                  <div className="uk-margin-small-right">
                    <label>Data execução</label>
                    <DatePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      value={
                        !(selectedIndex === index)
                          ? moment(medicalPrescription?.created_at)
                          : moment(data?.selectedDate)
                      }
                      disabled={!(selectedIndex === index)}
                      onChange={(e) => setData({ ...data, selectedDate: e })}
                    />
                  </div>
                  <div className={`uk-margin-top uk-margin-left uk-flex`}>
                    <HiOutlinePencilAlt
                      className={`active-edit-icon edit-icon ${
                        medicalPrescription?.executed_at && "inactive-icon"
                      }`}
                      size={40}
                      onClick={() => {
                        if (data?.executionUserId) {
                          handleSubmit({ ...medicalPrescription, ...data });
                          setData({});
                          setSelectedIndex("");
                        }
                        if (!medicalPrescription?.executed_at) {
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
                        if (!medicalPrescription?.user) {
                          handleSubmit({ ...medicalPrescription, ...data });
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
                <div className="uk-margin-small-top">
                  <label>Observação</label>
                  <TextArea
                    value={
                      !(selectedIndex === index)
                        ? medicalPrescription?.description
                        : data?.observationOnExecution
                    }
                    disabled={!(selectedIndex === index)}
                    onChange={(e) =>
                      setData({
                        ...data,
                        observationOnExecution: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            );
          })
        ) : (
          <>Nenhuma prescrição agendada para a data selecionada</>
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

export default ByHour;
