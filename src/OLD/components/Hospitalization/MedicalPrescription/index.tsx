// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import { Container } from "./styles";
import { Input, DatePicker, TimePicker } from "antd";
import IntervalForm from "./IntervalForm";
import MedicamentForm from "./MedicamentForm";
import FluidTherapy from "./FluidTherapy";
import { Button, PageWrapper, useToast } from "infinity-forge";
const { TextArea } = Input;

// Hooks
import { useMedicalPrescription } from "@/OLD/hooks/useMedicalPrescriptions";

// Services
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";

// Utils
import moment from "moment";
import { MedicalPrescription } from "@/presentation";
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

export default function MedicalPrescriptioan({ duplicate = false }) {
  const router = useRouter();
  const [type, setType] = useState("PROCEDURE");
  const [intervalType, setIntervalType] = useState("RECURRENT");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { createToast } = useToast();

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
      return createToast({
        status: "error",
        message: "Informe a data e hora de inicio da execução",
      });
    }

    if (intervalType === "RECURRENT") {
      if (!data?.frequencyUnit) {
        return createToast({
          status: "error",
          message: "Informe o tipo de intervalo (Horas ou dias)",
        });
      }

      if (!data?.frequencyQuantityUnit) {
        return createToast({
          status: "error",
          message: "Informe o tipo de duração (horas ou dias)",
        });
      }
    }

    if (type !== "PROCEDURE") {
      if (!data?.prescriptionUnitId) {
        return createToast({
          status: "error",
          message: "Informe o tipo de unidade",
        });
      }

      if (!data?.drugAdministrationId) {
        return createToast({
          status: "error",
          message: "informe a via de aplicação",
        });
      }

      if (type === "FLUID_THERAPY") {
        if (!data?.fluidSet) {
          return createToast({ status: "error", message: "Informe o equipo" });
        }
        if (!data?.fluidUnitId) {
          return createToast({
            status: "error",
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
        return createToast({
          status: "success",
          message: "Prescrição médica registrada com sucesso!",
        });
      })
      .catch((err) => {
        error = true;
        setLoading(false);
        if (err?.response?.data?.errors) {
          return createToast({
            status: "error",
            message: err?.response?.data?.errors[0].message,
          });
        }
        if (err?.response?.data?.message) {
          return createToast({
            status: "error",
            message: err?.response?.data?.message,
          });
        }
        return createToast({
          status: "error",
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
    <PageWrapper title="Prescrição Médica">
      <MedicalPrescription />
      <Container>
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
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  // type={type === "PROCEDURE" ? "primary" : ""}
                  type="button"
                  onClick={() => {
                    setType("PROCEDURE");
                    setIntervalType("RECURRENT");
                  }}
                  text="Procedimento"
                />
                <Button
                  type="button"
                  // type={type === "MEDICATION" ? "primary" : ""}
                  onClick={() => setType("MEDICATION")}
                  text="Medicamento"
                />
                <Button
                  type="button"
                  // type={type === "FLUID_THERAPY" ? "primary" : ""}
                  onClick={() => setType("FLUID_THERAPY")}
                  text="Fluidoterapia"
                />
              </div>
            </div>
            <div className="uk-width-2-4">
              <label>Recorrência</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="button"
                  onClick={() => setIntervalType("")}
                  text=""
                />

                <Button
                  type="button"
                  // type={intervalType === "ONCE" ? "primary" : ""}
                  onClick={() => setIntervalType("ONCE")}
                  text=""
                />

                <Button
                  type="button"
                  // type={intervalType === "WHEN_NEEDED" ? "primary" : ""}
                  onClick={() => setIntervalType("")}
                  text=""
                />
              </div>
            </div>
          </section>
          <p style={{ marginTop: "30px" }}>
            <h2>
              {labelControl(type)} - {labelControl(intervalType)}
            </h2>
            <hr />
          </p>
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
          <footer
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button type="submit" text="Salvar" />

            <Button type="button" onClick={() => router.back()} text="Voltar" />
          </footer>
        </form>
      </Container>
    </PageWrapper>
  );
}
