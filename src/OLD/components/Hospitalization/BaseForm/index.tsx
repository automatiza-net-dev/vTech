// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";

// Services
import { hospitalizationOccurences } from "@/OLD/services/hospitalizationsOcurrences.service";
import { hospitalizationService } from "@/OLD/services/hospitalization.service";
import { clinicService } from "@/OLD/services/clinic.service";

const dischargeTypes = [
  { id: 1, value: "AI" },
  { id: 2, value: "AO" },
  { id: 3, value: "AU" },
];

// Components
import {
  Modal,
  AutoComplete,
  DatePicker,
  TimePicker,
  Input,
  notification,
  Select,
} from "antd";
import { Button } from "infinity-forge";
import HeaderForm from "../HeaderForm";
import FormFooter from "@/OLD/components/mini-components/CustomFormFooter";
import Editor from "@/OLD/components/Editor";
import UploadArquives from "../Arquives";
import Details from "./Details";
import Print from "@/OLD/components/mini-components/Print";
const { Option } = Select;

// Utils
import moment from "moment";
import { useLoadDashboard } from "@/presentation";

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

  const finalizeHospitalization = useCallback(() => {
    hospitalizationService
      .finalizeHospitalization(patientData?.id)
      .then((_res) =>
        notification.success({
          message: "Hospitalização finalizada com sucesso!",
        })
      )
      .catch((err) =>
        notification.error({
          message: "Houve um erro ao finalizar a hospitalização do paciente",
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
        return notification.error({
          message: "Houve um erro ao buscar as ocorrências para registro",
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

  const occurrenceFormat = (data) => {
    const formData = new FormData();
    formData.append("hospitalizationId", patientData?.id);
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
    formData.append("userId", data?.selectedVetId);

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
      resume: "Óbito (OB)",
      executedAt: moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString(),
      previewedAt: moment(new Date()).toISOString(),
      userId: data?.selectedVetId,
    };
  };

  const medicalReportFormat = (data) => {
    return {
      hospitalizationId: patientData?.id,
      occurrenceId: allOccurrences.find((item) => item?.type === "RM")?.id,
      description: body,
      resume: "Relatório médico",
      executedAt: moment(data?.executedAt)
        .hours(parseInt(moment(data?.hour).format("HH")))
        .minutes(parseInt(moment(data?.hour).format("mm")))
        .toISOString(),
      previewedAt: moment(new Date()).toISOString(),
      userId: data?.selectedVetId,
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
        return notification.warning({
          message: "Paciente já recebeu alta, ação indisponível",
        });
      }

      if (patientData?.death_at) {
        setVisible(false);
        return notification.warning({
          message: "Paciente veio a óbito, ação indisponível",
        });
      }
    }
  }, [formType, patientData]);

  const submitOccurrenceFormData = useCallback(async () => {
    setLoading(true);
    await hospitalizationOccurences
      .createOccurrence(formTreatment(formType, data))
      .then((res) => {
        notification.success({
          message: `${title} salvo com sucesso!`,
        });

        if (["Óbito", "Alta"].includes(title)) {
          return notification.warning({
            key: "discharge",
            message: (
              <div>
                <p className="uk-margin-remvoe">
                  Deseja finalizar a internação?
                </p>
                <div className="uk-flex uk-flex-around">
                  <Button
                    onClick={() => {
                      finalizeHospitalization();
                      notification.destroy({ key: "discharge" });
                    }}
                    text="Sim"
                  />

                  <Button
                    onClick={() => notification.destroy({ key: "discharge" })}
                    text="Não"
                  />
                </div>
              </div>
            ),
          });
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
      visible={visible}
      onCancel={() => setVisible(false)}
      title={title}
      footer={null}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await submitOccurrenceFormData();
            notification.success({
              message: `Ocorrência gerada com sucesso!`,
            });
          } catch (error) {
            notification.error({
              message: `Ocorreu um erro ao gerar a ocorrência.`,
            });
          }
        }}
      >
        <HeaderForm patientData={patient} />
        {formType !== "details" ? (
          <>
            <div className="uk-width-1-1">
              <label>Veterinário responsável</label>
              <AutoComplete
                className="uk-width-1-1"
                options={allVets}
                value={data?.user}
                onSelect={(e, option) =>
                  setData({ ...data, user: e, selectedVetId: option.id })
                }
                onChange={(e) => setData({ ...data, user: e })}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().includes(inputValue.toUpperCase())
                    ? option
                    : null
                }
              />
            </div>
            <div className="uk-margin-top uk-flex uk-flex-between">
              <div>
                <label>Data</label>
                <br />
                <DatePicker
                  format={"DD/MM/YYYY"}
                  onChange={(e) => setData({ ...data, executedAt: e })}
                  value={
                    data?.executedAt
                      ? moment(data?.executedAt)
                      : moment(data?.executedAt)
                  }
                />
              </div>
              <div>
                <label>Hora</label>
                <br />
                <TimePicker
                  format={"HH:mm"}
                  onChange={(e) => setData({ ...data, hour: e })}
                  value={moment(data?.hour)}
                />
              </div>
            </div>
            {formType === "discharge" && (
              <div className="uk-margin-top">
                <label>Tipo Alta</label>
                <Select
                  className="uk-width-1-1"
                  onChange={(val) => setData({ ...data, dischargeType: val })}
                >
                  <Option value="Alta indicada">Alta indicada</Option>
                  <Option value="Não indicada">Alta sem indicação</Option>
                </Select>
              </div>
            )}
            {detectForm(formType) && (
              <div className="uk-margin-top">
                <label>{detectForm(formType)}</label>
                <Input
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  type={formType === "weight" ? "number" : "text"}
                  value={data?.description}
                />
              </div>
            )}
            <div className="uk-margin-top">
              <label>{report}</label>
              <Editor
                editorState={body}
                setEditorState={setBody}
                value={body}
              />
            </div>
            {formType === "occurrence" && (
              <UploadArquives fileList={fileList} setFileList={setFileList} />
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
                    notification.error({
                      message: `Preencha todos os campos.`,
                    });
                    throw new Error(error?.message);
                  }
                }}
              />
            )}
            <FormFooter setVisible={setVisible} />
          </>
        ) : (
          <Details patient={patient} setVisible={setVisible} />
        )}
      </form>
    </Modal>
  );
}

export default BaseForm;

// crmDashboard=true

// async function GetDashbooad() {

//   switch(type === "crm") {

//     case "crm": return service.crm.dashboard()

//     case "franqueado": return service.franqueado.dashboard()

//     default "dashboard": return service.dashboard.dashboard()
//   }
// }

// useLoadDashboard()
// useLoadDashboard({ type: "crm" })
