// @ts-nocheck
import React, { memo, useState, useCallback, useEffect } from "react";

import moment from "moment";
import {
  Button,
  Modal,
  Select,
  InputDatePicker,
  Input,
  useToast,
  FormHandler,
} from "infinity-forge";

import { useProfile } from "@/OLD/hooks/useProfile";
import { clinicService } from "@/OLD/services/clinic.service";
import { hospitalizationService } from "@/OLD/services/hospitalization.service";
import { hospitalizationOccurences } from "@/OLD/services/hospitalizationsOcurrences.service";

import Details from "./Details";
import HeaderForm from "../HeaderForm";
import UploadArquives from "../Arquives";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";
import FormFooter from "@/OLD/components/mini-components/CustomFormFooter";

import * as S from "./styles";

const dischargeTypes = [
  { id: 1, value: "AI" },
  { id: 2, value: "AO" },
  { id: 3, value: "AU" },
];

const detectForm = (str) => {
  switch (str) {
    case "weight":
      return "Peso(Kg)";
    case "occurrence":
      return "Descrição da ocorrência";
    default:
      return false;
  }
};

function BaseForm({
  visible,
  setVisible,
  title,
  report,
  formType,
  patientData,
  reload,
  setReload,
  selectedHour,
}) {
  const [body, setBody] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [patient, setPatient] = useState({});
  const [allOccurrences, setAllOccurrences] = useState([]);
  const [dischargeType, setDischargeType] = useState("");
  const [allVets, setAllVets] = useState([]);
  const { user } = useProfile();
  const { createToast } = useToast();

  const finalizeHospitalization = useCallback(() => {
    hospitalizationService
      .finalizeHospitalization(patientData?.id)
      .then((_res) =>
        createToast({
          message: "Hospitalização finalizada com sucesso!",
          status: "success",
        })
      )
      .catch((err) =>
        createToast({
          message: "Houve um erro ao finalizar a hospitalização do paciente",
          status: "error",
        })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  }, [patientData?.id]);

  const getAllOccurrences = useCallback(() => {
    setLoading(true);
    hospitalizationOccurences
      .getAllBaseOccurrences()
      .then((res) => setAllOccurrences(res.data))
      .catch((_err) => {
        return createToast({
          message: "Houve um erro ao buscar as ocorrências para registro",
          status: "error",
        });
      });
  }, []);

  const getVets = useCallback(() => {
    setLoading(true);
    clinicService
      .getColaborators({})
      .then((res) =>
        setAllVets(
          res.data.map((item) => {
            return {
              label: item?.name,
              value: item?.id,
            };
          })
        )
      )
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Não foi possível buscar os veterinários disponíveis.",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const occurrenceFormat = (data) => {
    const formData = new FormData();
    formData.append("hospitalizationId", patientData?.id);
    formData.append("userId", data.userId);
    formData.append(
      "occurrenceId",
      allOccurrences.find((item) => item?.type === "OC")?.id
    );
    formData.append(
      "executedAt",
      moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString()
    );
    formData.append("previewedAt", moment(new Date()).toISOString());
    formData.append("resume", data?.description);
    formData.append("description", body);

    if (fileList.length > 0) {
      fileList.forEach((item) =>
        formData.append("attachments[]", item.originFileObj)
      );
    }

    return formData;
  };

  const weightFormat = (data) => {
    const formData = new FormData();
    formData.append("hospitalizationId", patientData?.id);
    formData.append("userId", data.userId);
    formData.append(
      "occurrenceId",
      allOccurrences.find((item) => item?.type === "P")?.id
    );
    formData.append(
      "executedAt",
      moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString()
    );
    formData.append("previewedAt", moment(new Date()).toISOString());
    formData.append("resume", data?.description);
    formData.append("description", body);
    return formData;
  };

  const dischargeFormat = (data) => {
    return {
      hospitalizationId: patientData?.id,
      occurrenceId: allOccurrences.find((item) => item?.type === dischargeType)
        ?.id,
      description: body,
      userId: data.userId,
      resume: `Alta (${dischargeType}) - ${data?.dischargeType}`,
      executedAt: moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString(),
      previewedAt: moment(new Date()).toISOString(),
      userId: data?.selectedVetId,
    };
  };

  const deathReportFormat = (data) => {
    return {
      hospitalizationId: patientData?.id,
      occurrenceId: allOccurrences.find((item) => item?.type === "OB")?.id,
      description: body,
      userId: data.userId,
      resume: "Óbito (OB)",
      executedAt: moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString(),
      previewedAt: moment(new Date()).toISOString(),
    };
  };

  const medicalReportFormat = (data) => {
    return {
      hospitalizationId: patientData?.id,
      occurrenceId: allOccurrences.find((item) => item?.type === "RM")?.id,
      description: body,
      resume: "Relatório médico",
      userId: data.userId,
      executedAt: moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString(),
      previewedAt: moment(new Date()).toISOString(),
    };
  };

  const formTreatment = (type, data) => {
    if (type === "occurrence") {
      return occurrenceFormat(data);
    }

    if (type === "weight") {
      return weightFormat(data);
    }

    if (type === "discharge") {
      return dischargeFormat(data);
    }

    if (type === "deathReport") {
      return deathReportFormat(data);
    }

    if (type === "medicalPrescription" || "medicalReport") {
      return medicalReportFormat(data);
    }
  };

  useEffect(() => {
    selectedHour && setData({ ...data, hour: moment(selectedHour, "HH:mm") });
    setPatient(patientData);
    setDischargeType(
      dischargeTypes.find((item) => item.id === patientData.type)?.value
    );
    visible && getAllOccurrences();
    visible && getVets();
  }, [patientData, visible, getAllOccurrences, selectedHour]);

  useEffect(() => {
    if (formType === "discharge" || formType === "deathReport") {
      const occurrencesEvents = patientData?.occurrences?.map(
        (item) => item?.occurrence?.description
      );

      if (occurrencesEvents.includes("Alta Observação")) {
        setVisible(false);
        return createToast({
          message: "Paciente já recebeu alta, ação indisponível",
          status: "error",
        });
      }

      if (patientData?.death_at) {
        setVisible(false);
        return createToast({
          message: "Paciente veio a óbito, ação indisponível",
          status: "error",
        });
      }
    }
  }, [formType, patientData]);

  const submitOccurrenceFormData = useCallback(async () => {
    setLoading(true);
    await hospitalizationOccurences
      .createOccurrence(formTreatment(formType, data))
      .then((res) => {
        createToast({
          message: `${title} salvo com sucesso!`,
          status: "success",
        });

        if (["Óbito", "Alta"].includes(title)) {
          if (confirm("Deseja finalizar a internação ?")) {
            finalizeHospitalization();
          }
        }
      });

    setLoading(false);
    setVisible(false);
    setData({});
    setBody("");
    setReload(!reload);
    setFileList([]);
    setLoading(false);
  }, [data, body, fileList, patientData]);

  return (
    <Modal
      open={visible}
      styles={{ maxWidth: "600px", padding: "10px" }}
      onClose={() => setVisible(false)}
      children={
        <S.BaseForm>
          <FormHandler
          initialData={{executedAt: new Date()}}
            onChangeForm={{ callbackResult: (payload) => setData(payload) }}
            customAction={{
              Component: () => (
                <Button
                  onClick={() => {
                    setVisible(false);
                  }}
                  style={{ backgroundColor: "#ff7b5a" }}
                  text="Cancelar"
                />
              ),
            }}
            customSubmit={[
              {
                action: async () => {
                  try {
                    await submitOccurrenceFormData();
                    createToast({
                      message: `Ocorrência gerada com sucesso!`,
                      status: "success",
                    });
                  } catch (error) {
                    createToast({
                      message: `Ocorreu um erro ao gerar a ocorrência.`,
                      status: "error",
                    });
                  }
                },
                active: true,
                props: () => ({
                  text: "Salvar",
                }),
              },
            ]}
          >
            <h2>{title}</h2>
            <HeaderForm patientData={patient} />
            {formType !== "details" ? (
              <>
                <div>
                  <Select
                    onlyOneValue
                    name="userId"
                    label="Veterinário responsável"
                    options={allVets}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <InputDatePicker name="executedAt" label="Data" />

                  <InputDatePicker mode="timer" label="Hora" name="hour" />
                </div>
                {formType === "discharge" && (
                  <div>
                    <Select
                      onlyOneValue
                      label="Tipo Alta"
                      name="dischargeType"
                      options={[
                        { label: "Alta indicada", value: "Alta indicada" },
                        { label: "Alta não indicada", value: "Não indicada" },
                      ]}
                    />
                  </div>
                )}
                {detectForm(formType) && (
                  <div>
                    <Input
                      label={detectForm(formType)}
                      name="description"
                      type={formType === "weight" ? "number" : "text"}
                    />
                  </div>
                )}
                <div>
                  <label>{report}</label>
                  <Editor
                    editorState={body}
                    setEditorState={setBody}
                    value={body}
                  />
                </div>
                {formType === "occurrence" && (
                  <UploadArquives
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                )}
                {report === "Relatório médico" && (
                  <Print
                    tutor={patient?.tutor}
                    patient={patient?.patient}
                    triggerComponent={
                      <Button style={{ marginTop: "10px" }} text="Imprimir" />
                    }
                    content={body}
                    title={"Relatório médico"}
                    string={true}
                    onBeforePrint={async () => {
                      try {
                        await submitOccurrenceFormData();
                        return true;
                      } catch (error) {
                        createToast({
                          message: `Preencha todos os campos.`,
                          status: "error",
                        });
                        throw new Error(error?.message);
                      }
                    }}
                  />
                )}
              </>
            ) : (
              <Details patient={patient} setVisible={setVisible} />
            )}
          </FormHandler>
        </S.BaseForm>
      }
    />
  );
}

export default BaseForm;
