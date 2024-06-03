// @ts-nocheck
// Core
import React, { useEffect, useState, useCallback } from "react";

// Services
import { hospitalizationService } from "@/OLD/services/hospitalization.service";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Container } from "./styles";
import { Menu, notification, Popconfirm, Button } from "antd";
import BaseForm from "./BaseForm";
import HeaderControl from "./Date";
import PatientList from "./PatientList";
import {HospitalizationTimeline} from "./HospitalizationTimeline";
import AccessDenied from "@/OLD/components/AccessDenied";

// Utils
import moment from "moment";

const menu = (
  setObj,
  patient = false,
  router,
  permissions,
  selectedHour = false,
  finalizeHospitalization = false,
  setShowControl = false
) => {
  const shouldDischarge = patient?.occurrences?.find(
    (oc) =>
      oc?.occurrence?.description.includes("Alta") ||
      oc?.occurrence?.description.includes("Óbito")
  );

  const { generalLaunchPermission, medicalPrescriptionPermission } =
    permissions;

  const discharge = () => {
    return notification.warning({
      key: "discharge",
      message: (
        <div>
          <p>Paciente já recebeu alta!</p>
          <p className="uk-margin-remvoe">Deseja finalizar a internação ?</p>
          <div className="uk-flex uk-flex-around">
            <Button
              type="primary"
              onClick={() => {
                (finalizeHospitalization as any)();
                (notification as any).destroy({ key: "discharge" });
              }}
            >
              Sim
            </Button>
            <Button onClick={() => notification.destroy({ key: "discharge" })}>
              Não
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Menu
      items={[
        {
          key: "1",
          onClick: () =>
            setObj({
              visible: true,
              formTitle: "Dados da internação",
              report: "details",
              formType: "details",
            }),
          label: "Dados da internação",
        },
        generalLaunchPermission && {
          key: "2",
          onClick: () => {
            if (shouldDischarge) {
              return discharge();
            }

            setObj({
              visible: true,
              formTitle: "Alta",
              report: "Relatório da alta",
              formType: "discharge",
              selectedHour,
            });
          },
          label: "Alta de internação",
        },
        generalLaunchPermission && {
          key: "3",
          onClick: () =>
            setObj({
              visible: true,
              formTitle: "Ocorrência",
              report: "Detalhes da ocorrência",
              formType: "occurrence",
              selectedHour,
            }),
          label: "Ocorrência de internação",
        },
        generalLaunchPermission && {
          key: "4",
          onClick: () =>
            setObj({
              visible: true,
              formTitle: "Relatório Médico",
              formType: "medicalReport",
              report: "Relatório médico",
              selectedHour,
            }),
          label: "Relatório médico",
        },
        medicalPrescriptionPermission && {
          key: "5",
          onClick: () => setShowControl(patient.id),
          label: "Prescrição médica",
        },
        generalLaunchPermission && {
          key: "6",
          onClick: () => {
            if (shouldDischarge) {
              return discharge();
            }

            setObj({
              visible: true,
              formTitle: "Óbito",
              report: "Relatório do Óbito",
              formType: "deathReport",
              selectedHour,
            });
          },
          label: "Óbito",
        },
        generalLaunchPermission && {
          key: "7",
          onClick: () =>
            setObj({
              visible: true,
              formTitle: "Peso",
              report: "Observações",
              formType: "weight",
              selectedHour,
            }),
          label: "Peso",
        },
        finalizeHospitalization &&
          generalLaunchPermission && {
            key: "8",
            label: (
              <Popconfirm
                title="Deseja finalizar esta internação? "
                onConfirm={finalizeHospitalization}
              >
                Finalizar internação
              </Popconfirm>
            ),
          },
        {
          key: "9",
          onClick: () =>
            setObj({
              timeline: true,
            }),
          label: "Registros de internação",
        },
        {
          key: "10",
          onClick: () => {
            router.push(`/dashboard/atendimento/${patient?.patient?.id}`);
          },
          label: "Ficha paciente",
        },
      ]}
    />
  );
};

export default function HospitalizationTable() {
  const [formsVisible, setFormsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment(new Date()));
  const [selectedPatient, setSelectedPatient] = useState({});
  const [allHospitalizations, setAllHospitalizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const showHospitalizationsPermission = useUserHasPermission("INT00");

  const getAllHospitalizations = useCallback(() => {
    setLoading(true);
    hospitalizationService
      .listHospitalizations()
      .then((res) =>
        setAllHospitalizations(res.data.sort((a, b) => b.risk - a.risk))
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao listar os pacientes hospitalizados...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload]);

  useEffect(() => {
    getAllHospitalizations();
  }, [getAllHospitalizations, selectedDate]);

  return !showHospitalizationsPermission ||
    showHospitalizationsPermission === "loading" ? (
    <AccessDenied loading={showHospitalizationsPermission} />
  ) : (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Agenda de internação</h3>
      <BaseForm
        reload={reload}
        setReload={setReload}
        patientData={selectedPatient}
        visible={formsVisible?.visible}
        title={formsVisible?.formTitle}
        setVisible={setFormsVisible}
        report={formsVisible?.report}
        formType={formsVisible?.formType}
        selectedHour={formsVisible?.selectedHour}
      />
   <HeaderControl
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        classCallback="uk-margin-top"
      /> 
      <PatientList
        reload={reload}
        setReload={setReload}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        patientData={allHospitalizations}
        menu={menu}
        setFormsVisible={setFormsVisible}
        selectedDate={moment(selectedDate).format("DD/MM/YYYY")}
      /> 
       <HospitalizationTimeline
        visible={formsVisible.timeline}
        setVisible={setFormsVisible}
        modal={true}
        patientData={selectedPatient}
      /> 
    </Container>
  );
}

