// @ts-nocheck
// Core
import React from "react";

// Components
import { Container } from "./styles";
import {
  AddExam,
  AddWeight,
  AddDocuments,
  AddMedicalRecipe,
  AddNotes,
  AddPatologies,
  AddPhotos,
  Attendance,
  Hospitalization,
} from "@/OLD/components/Attendance/Forms-old";
import DosesModal from "../../LaunchedVaccinesList/DosesModal";

// Utils
import moment from "moment";

export  function Vaccine({
  selectedUpdate,
  patient,
  reload,
  setReload,
  setSelectedUpdate,
  setActiveTab,
}: any) {
  const formControl = (str) => {
    switch (str) {
      case "Vacinas":
        return {
          title: "Registro de vacina",
          inf: "Vacina",
        };

      case "Peso":
        return {
          title: "Registro de peso",
          inf: "Peso",
        };

      case "Glicemia":
        return {
          title: "Registro de glicemia",
          inf: "Peso",
        };

      case "Aferição de Pressão":
        return {
          title: "Registro de Aferição de Pressão",
          inf: "Peso",
        };

      case "Exames":
        return {
          title: "Registro de exames",
          inf: "Exame",
        };

      case "Patologia":
        return {
          title: "Registro de patologia",
          inf: "Patologia",
        };

      case "Formato Receita Médica":
        return {
          title: "Registro de receita médica",
          inf: "Receita médica",
        };

      case "Fotos":
        return {
          title: "Registro de fotos",
          inf: "Fotos",
        };

      case "Documento":
        return {
          inf: "Documento",
          title: "Registro de documento",
        };

      case "Observação":
        return {
          inf: "Observacao",
          title: "Observações",
        };

      case "Patologia":
        return {
          inf: "Patologia",
          title: "Registro de patologia",
        };

      case "Fotos":
        return {
          inf: "Fotos",
          title: "Registro de fotos",
        };

      case "Avaliação":
        return {
          inf: "Consulta",
          title: "Avaliação",
        };

      case "Consulta":
        if (!selectedUpdate?.timeline_info?.event) {
          return {
            inf: "Consulta",
            title: "Registro de consulta",
          };
        }

        if (selectedUpdate?.timeline_info?.event === "TROCA_TUTOR_PRINCIPAL") {
          return {
            inf: "Troca tutor",
            title: "Troca de tutor principal",
          };
        } else {
          return {
            inf: "Hospitalização",
            title: "Registro de internação",
          };
        }

      case "Hospitalização":
        return;

      default:
        return null;
    }
  };

  const formInfo = formControl(selectedUpdate?.timeline_type?.description);

  return (
    <Container className="uk-margin-large-right uk-padding-small">
      <h4>{formInfo?.title}</h4>
      {formInfo?.inf === "Consulta" && (
        <div>
          <p className="uk-margin-remove">
            <strong>
              Aberto em&nbsp;
              {moment(selectedUpdate?.timeline_info?.realizedAt).format(
                "DD/MM/YYYY HH:mm"
              )}{" "}
              por {selectedUpdate?.timeline_info?.technician?.name}
            </strong>
          </p>
          {selectedUpdate?.timeline_info?.finishedAt && (
            <p className="uk-margin-remove">
              <strong>
                Finalizado em{" "}
                {moment(selectedUpdate?.timeline_info?.finishedAt).format(
                  "DD/MM/YYYY HH:mm"
                )}{" "}
                por {selectedUpdate?.timeline_info?.technician?.name}
              </strong>
            </p>
          )}
        </div>
      )}
      {formInfo?.inf === "Exame" && (
        <AddExam
          visible={false}
          setVisible={false}
          patient={patient}
          reload={reload}
          setReload={setReload}
          modal={false}
          examPatientData={{
            ...selectedUpdate?.timeline_info?.patient_exam,
            timelineId: selectedUpdate?._id,
          }}
          setSelectedPatientExam={setSelectedUpdate}
        />
      )}
      {formInfo?.inf === "Peso" && (
        <AddWeight
          patient={patient}
          visible={false}
          setVisible={false}
          setSelectedUpdate={setSelectedUpdate}
          modal={false}
          updateData={{
            ...selectedUpdate?.timeline_info,
            id: selectedUpdate?._id,
          }}
          reload={reload}
          setReload={setReload}
        />
      )}
      {formInfo?.inf === "Documento" && (
        <AddDocuments
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
        />
      )}
      {formInfo?.inf === "Receita médica" && (
        <AddMedicalRecipe
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
        />
      )}
      {formInfo?.inf === "Observacao" && (
        <AddNotes
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
          flex={true}
        />
      )}
      {formInfo?.inf === "Patologia" && (
        <AddPatologies
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
        />
      )}
      {formInfo?.inf === "Fotos" && (
        <AddPhotos
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
        />
      )}
      {formInfo?.inf === "Vacina" && (
        <DosesModal
          setActiveTab={setActiveTab}
          modal={false}
          setVisible={false}
          visible={false}
          setSelectedUpdate={setSelectedUpdate}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          reload={reload}
          setReload={setReload}
          patient={patient}
          vaccine={selectedUpdate?.timeline_info?.patient_vaccine?.id}
          data={selectedUpdate}
        />
      )}
      {formInfo?.inf === "Consulta" && (
        <Attendance
          visible={false}
          setVisible={false}
          reload={reload}
          setReload={setReload}
          setSelectedUpdate={setSelectedUpdate}
          modal={false}
          updateData={{ ...selectedUpdate, id: selectedUpdate?._id }}
          patient={patient}
        />
      )}
      {formInfo?.inf === "Hospitalização" && (
        <Hospitalization
          patient={patient}
          visible={false}
          setVisible={false}
          reload={false}
          setReload={setReload}
          modal={false}
          updateData={selectedUpdate}
        />
      )}
      {formInfo?.inf === "Troca tutor" && (
        <section>
          {selectedUpdate?.timeline_info?.old_tutor?.name && (
            <p className="uk-margin-remove">
              De: {selectedUpdate?.timeline_info?.old_tutor?.name}
            </p>
          )}
          <p className="uk-margin-remove">
            Para: {selectedUpdate?.timeline_info?.new_tutor?.name}
          </p>
        </section>
      )}
    </Container>
  );
}
