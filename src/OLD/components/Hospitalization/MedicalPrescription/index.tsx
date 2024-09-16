// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import { Container } from "./styles";
import { Input, notification, DatePicker, TimePicker } from "antd";
import IntervalForm from "./IntervalForm";
import MedicamentForm from "./MedicamentForm";
import FluidTherapy from "./FluidTherapy";
import { Button } from "infinity-forge";
const { TextArea } = Input;

// Hooks
import { useMedicalPrescription } from "@/OLD/hooks/useMedicalPrescriptions";

// Services
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";

// Utils
import moment from "moment";
export default function MedicalPrescription({ duplicate = false }) {
  const router = useRouter();
  const [type, setType] = useState("PROCEDURE");
  const [intervalType, setIntervalType] = useState("RECURRENT");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { medicalPrescription } = useMedicalPrescription(router.query.id);

  const hospitalizationId = router.query.id;

  const toFillFields = () => {
    setType(medicalPrescription?.type);
    setIntervalType(medicalPrescription?.frequency);
    setData({
      description: medicalPrescription?.description,
      resume: medicalPrescription?.resume,
      dose: medicalPrescription?.dose,
      volume: medicalPrescription?.volume,
      fluidSet: medicalPrescription?.fluid_set,
      fluidSpeed: medicalPrescription?.fluid_speed,
      supplement: medicalPrescription?.supplement,
      frequencyInterval: medicalPrescription?.frequency_interval,
      frequencyUnit: medicalPrescription?.frequency_unit,
      frequencyQuantityUnit: medicalPrescription?.frequency_quantity_unit,
      prescriptionUnitId: medicalPrescription?.prescriptionUnit?.id,
      prescriptionUnitDescription: medicalPrescription?.prescriptionUnit?.name,
      drugAdministrationId: medicalPrescription?.drugAdministration?.id,
      drugAdministrationDescription:
        medicalPrescription?.drugAdministration?.description,
      fluidUnitDescription: medicalPrescription?.fluidUnit?.name,
      fluidUnitId: medicalPrescription?.fluidUnit?.id,
    });
  };

  useEffect(() => {
    duplicate && medicalPrescription && toFillFields();
  }, [duplicate, router?.query?.innerid, medicalPrescription]);

  const verifyFields = () => {
    if (!data?.executionStart || !data?.executionHour) {
      return notification.warning({
        message: "Informe a data e hora de inicio da execução",
      });
    }

    if (intervalType === "RECURRENT") {
      if (!data?.frequencyUnit) {
        return notification.warning({
          message: "Informe o tipo de intervalo (Horas ou dias)",
        });
      }

      if (!data?.frequencyQuantityUnit) {
        return notification.warning({
          message: "Informe o tipo de duração (horas ou dias)",
        });
      }
    }

    if (type !== "PROCEDURE") {
      if (!data?.prescriptionUnitId) {
        return notification.warning({ message: "Informe o tipo de unidade" });
      }

      if (!data?.drugAdministrationId) {
        return notification.warning({ message: "informe a via de aplicação" });
      }

      if (type === "FLUID_THERAPY") {
        if (!data?.fluidSet) {
          return notification.warning({ message: "Informe o equipo" });
        }
        if (!data?.fluidUnitId) {
          return notification.warning({
            message: "informe a unidade de velocidade",
          });
        }
      }
    }

    return true;
  };

  const handleSubmit = useCallback(() => {
    setLoading(true);

    if (!verifyFields()) {
      return;
    }
    let error = false;
    const newObj = { ...data };
    delete newObj?.executionHour;
    hospitalizationPrescriptionsService
      .create({
        ...newObj,
        executionStart: moment(data?.executionStart)
          .hours(parseInt(moment(data?.executionHour).format("HH")))
          .minutes(parseInt(moment(data?.executionHour).format("mm")))
          .toISOString(),
        hospitalizationId,
        type,
        frequency: intervalType,
        prescribedAt: moment(new Date()),
      })
      .then((res) => {
        return notification.success({
          message: "Prescrição médica registrada com sucesso!",
        });
      })
      .catch((err) => {
        error = true;
        setLoading(false);
        if (err?.response?.data?.errors) {
          return notification.error({
            message: err?.response?.data?.errors[0].message,
          });
        }
        if (err?.response?.data?.message) {
          return notification.error({
            message: err?.response?.data?.message,
          });
        }
        return notification.error({
          message: "Houve um erro ao cadastrar a prescrição médica",
        });
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          router.back();
        }
      });
  }, [data, type, intervalType]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Prescrição Médica</h3>
      <form
        className="body-form uk-card uk-card-body uk-margin-top"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <section className="uk-margin-top uk-flex">
          <div className="uk-width-2-4">
            <label>Tipo</label>
            <div className="uk-margin-small-top">
              <Button
                // type={type === "PROCEDURE" ? "primary" : ""}
                onClick={() => {
                  setType("PROCEDURE");
                  setIntervalType("RECURRENT");
                }}
                text="Procedimento"
              />
              <Button
                type={type === "MEDICATION" ? "primary" : ""}
                onClick={() => setType("MEDICATION")}
                text="Medicamento"
              />
              <Button
                // type={type === "FLUID_THERAPY" ? "primary" : ""}
                onClick={() => setType("FLUID_THERAPY")}
                text="Fluidoterapia"
              />
            </div>
          </div>
          <div className="uk-width-2-4">
            <label>Recorrência</label>
            <div className="uk-margin-small-top">
              <Button
                type={intervalType === "RECURRENT" ? "primary" : ""}
                onClick={() => setIntervalType("RECURRENT")}
                text="Recorrente"
              />

              <Button
                // type={intervalType === "ONCE" ? "primary" : ""}
                onClick={() => setIntervalType("ONCE")}
                text="Apenas uma vez"
              />

              <Button
                // type={intervalType === "WHEN_NEEDED" ? "primary" : ""}
                onClick={() => setIntervalType("WHEN_NEEDED")}
                text="Quando necessário"
              />
            </div>
          </div>
        </section>
        <section className="uk-margin-top uk-flex">
          <div>
            <label>Inicio da execução</label>
            <br />
            <DatePicker
              className="uk-margin-small-right"
              required
              onChange={(e) => setData({ ...data, executionStart: e })}
              format="DD/MM/YYYY"
              value={data?.executionStart}
            />
          </div>
          <div>
            <label>Horário de inicio</label>
            <br />
            <TimePicker
              required
              onChange={(e) => {
                setData({ ...data, executionHour: e });
              }}
              format="HH:mm"
              value={data?.executionHour}
            />
          </div>
        </section>

        {intervalType === "RECURRENT" && (
          <IntervalForm state={data} setState={setData} />
        )}
        <section>
          {type === "PROCEDURE" && (
            <div className="uk-margin-top">
              <label>Procedimento</label>
              <Input
                required
                value={data?.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
          )}
          {type === "MEDICATION" && (
            <MedicamentForm state={data} setState={setData} />
          )}
          {type === "FLUID_THERAPY" && (
            <FluidTherapy state={data} setState={setData} />
          )}
          <div className="uk-margin-top">
            <label>Descrição</label>
            <TextArea
              required
              value={data?.resume}
              onChange={(e) => setData({ ...data, resume: e.target.value })}
            />
          </div>
        </section>
        <footer className="uk-margin-top">
          <Button type="submit" text="Salvar" />

          <Button type="button" onClick={() => router.back()} text="Voltar" />
        </footer>
      </form>
    </Container>
  );
}
