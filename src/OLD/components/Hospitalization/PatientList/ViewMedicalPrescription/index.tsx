// @ts-nocheck
// Core
import React, { memo, useCallback, useState, useEffect } from "react";

// Components
import HeaderForm from "@/OLD/components/Hospitalization/HeaderForm";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  TimePicker,
  notification,
  Select,
} from "antd";
const { TextArea } = Input;

// Services
import { clinicService } from "@/OLD/services/clinic.service";
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";

// Utils
import moment from "moment";

const typeLabel = (str) => {
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

const intervalTypeLabel = (str) => {
  if (str === "RECURRENT") {
    return "Recorrente";
  }
  if (str === "ONCE") {
    return "Apenas uma vez";
  }
  if (str === "WHEN_NEEDED") {
    return "Quando necessário";
  }
};

const ViewMedicalPrescription = memo(function ViewMedicalPrescription({
  visible,
  setVisible,
  medicalPrescriptionData,
  patientData,
  reload,
  setReload,
  schedule = false,
}) {
  const [allVets, setAllVets] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeData, setTimeData] = useState({});
  // const { grudAdministration } = medicalPrescriptionData;
  // const { prescriptionUnit } = medicalPrescriptionData;

  useEffect(() => {
    if (visible) {
      setData({
        executionUserId: schedule?.executionUser?.id ?? null,
        observationOnExecution: schedule?.description ?? null,
      });
    }

    if (!visible) {
      setData({});
    }
  }, [visible, schedule]);

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
  }, [getVets]);

  const handleSubmitMedicalPrescription = useCallback(() => {
    setLoading(true);
    hospitalizationPrescriptionsService
      .update(medicalPrescriptionData?.id, {
        executedAt: moment(timeData?.data)
          .hours(parseInt(moment(timeData?.hour).format("HH")))
          .toISOString(),
        userId: data?.userId,
        hospitalizationId: patientData?.id,
        type: medicalPrescriptionData?.type,
        executionStart: medicalPrescriptionData?.execution_start,
        frequency: medicalPrescriptionData?.frequency,
        description: medicalPrescriptionData?.description,
        resume: medicalPrescriptionData?.resume,
        prescribedAt: moment(new Date()).toISOString(),
        prescriptionUnitId: medicalPrescriptionData?.prescriptionUnit?.id,
        dose: medicalPrescriptionData?.dose,
        drugAdministrationId: medicalPrescriptionData?.drugAdministration?.id,
        frequencyInterval: medicalPrescriptionData?.frequency_interval,
        frequencyUnit: medicalPrescriptionData?.frequency_unit,
        frequencyQuantity: medicalPrescriptionData?.frequency_quantity,
        frequencyQuantityUnit: medicalPrescriptionData?.frequency_quantity_unit,
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
        setReload(!reload);
        setVisible(false);
        setData({});
        setLoading(false);
      });
  }, [timeData, medicalPrescriptionData, data, timeData]);

  const handleSubmitSchedule = useCallback(() => {
    setLoading(true);

    hospitalizationPrescriptionsService
      .updateScheduling(schedule?.id, {
        type: schedule?.type,
        frequency: schedule?.frequency,
        scheduledAt: schedule?.scheduled_at,
        executedAt: moment(timeData?.data)
          .hours(parseInt(moment(timeData?.hour).format("HH")))
          .toISOString(),
        prescribedAt: schedule?.prescribed_at,
        description: data?.observationOnExecution,
        resume: schedule.resume,
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
  }, [data, schedule, medicalPrescriptionData, timeData]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title={`${typeLabel(medicalPrescriptionData?.type)} - ${intervalTypeLabel(
        medicalPrescriptionData?.frequency
      )}`}
    >
      <HeaderForm patientData={patientData} />
      {medicalPrescriptionData?.execution_start && (
        <div>
          <div>
            <label>Inicio da execução</label>
            <Input
              disabled={true}
              value={moment(medicalPrescriptionData?.execution_start).format(
                "DD/MM/YYYY - HH:mm"
              )}
            />
          </div>
        </div>
      )}
      {/*
      {medicalPrescriptionData?.description && (
        <div className="uk-margin-top">
          <label>Descrição:</label>
          <Input value={medicalPrescriptionData?.description} disabled={true} />
        </div>
      )}
      {medicalPrescriptionData?.dose && (
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-small-right">
            <label>Dose</label>
            <Input disabled={true} value={medicalPrescriptionData?.dose} />
          </div>
          <div>
            <label>Unidade</label>
            <Input value={prescriptionUnit.name} disabled={true} />
          </div>
        </div>
      )}
        */}
      <div className="uk-margin-small-top">
        <label>Resumo</label>
        <TextArea
          disabled={true}
          value={medicalPrescriptionData?.description}
        />
      </div>
      <div className="uk-margin-small-top">
        <label>Observação</label>
        <TextArea value={medicalPrescriptionData?.resume} disabled={true} />
      </div>
      <hr />
      <div className="uk-flex uk-flex-between">
        <h4>Execução</h4>
        <p className="uk-margin-remove">
          Data hora prevista:{" "}
          {moment(schedule?.scheduled_at).format("DD/MM/YYYY - HH:mm")}h
        </p>
      </div>
      <div className="uk-margin-top">
        <label>Veterinário responsável</label>
        <br />
        <Select
          disabled={
            !schedule ? medicalPrescriptionData?.user : schedule?.executed_at
          }
          value={data?.executionUserId}
          className="uk-width-1-1"
          onChange={(e) => setData({ ...data, executionUserId: e })}
        >
          {allVets.length > 0 &&
            allVets.map((vet, i) => (
              <Option key={i} value={vet?.id}>
                {vet?.value}
              </Option>
            ))}
        </Select>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-margin-small-right" style={{ width: "100%" }}>
          <label>Data de execução</label>
          <br />
          <DatePicker
            showTime
            disabled={
              !schedule ? medicalPrescriptionData?.user : schedule?.executed_at
            }
            format="DD/MM/YYYY HH:mm"
            value={
              schedule?.executed_at
                ? moment(schedule?.executed_at)
                : moment(timeData?.data)
            }
            onChange={(e) => setTimeData({ ...timeData, data: e })}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="uk-margin-top">
        <label>Observação</label>
        <TextArea
          onChange={(e) =>
            setData({ ...data, observationOnExecution: e.target.value })
          }
          disabled={
            !schedule ? medicalPrescriptionData?.user : schedule?.executed_at
          }
          value={data?.observationOnExecution}
        />
      </div>
      <hr />
      <footer className="uk-margin-top">
        <div className="uk-flex uk-flex-right">
          {!schedule?.executed_at && (
            <Button
              type="primary"
              className="uk-margin-right"
              onClick={() => {
                !schedule
                  ? handleSubmitMedicalPrescription()
                  : handleSubmitSchedule();
              }}
            >
              Executar
            </Button>
          )}
          <Button onClick={() => setVisible(false)}>Fechar</Button>
        </div>
      </footer>
    </Modal>
  );
});

export default ViewMedicalPrescription;
