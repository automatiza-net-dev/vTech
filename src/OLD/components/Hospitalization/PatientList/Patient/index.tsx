// @ts-nocheck
// Core
import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

// Components
import { Container, PatientBox } from "./styles";
import { List, Dropdown, Col, Row, notification } from "antd";
import ViewOccurrence from "../ViewOccurrence";
import ByHour from "../ByHour";
import ByPatient from "../ByPatient";
import HospitalizationControl from "../../Control";

// Services
import { hospitalizationService } from "@/OLD/services/hospitalization.service";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Utils
import moment from "moment";

// Icons
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleRight } from "react-icons/vsc";
import { MedicalPrescription } from "@/presentation";
import { Modal, Tooltip, useToast } from "infinity-forge";

const risks = [
  { id: 1, value: "Leve", color: "#2E8B57", textColor: "#F8F8FF" },
  { id: 2, value: "Médio", color: "#FFD700", textColor: "#1C1C1C" },
  { id: 3, value: "Grave", color: "#FF8C00", textColor: "#1C1C1C" },
  { id: 4, value: "Gravíssimo", color: "var(--red)", textColor: "#F8F8FF" },
];

const types = [
  { id: 1, value: "Internação" },
  { id: 2, value: "Observação" },
  { id: 3, value: "UTI" },
];

const detectClockColor = (hourItem, hourActual) => {
  return moment(hourItem).diff(moment(hourActual), "minutes") >= 0
    ? "blue"
    : "red";
};

const detectClockNonRecurrentColor = (str) => {
  if (str === "WHEN_NEEDED") return "yellow";
  if (str === "ONCE") return "gray";
};

const PatientData = memo(function PatientData({
  patients,
  menu,
  setFormsVisible,
  selectedPatient,
  setSelectedPatient,
  selectedDate,
  reload,
  setReload,
}) {
  const [occurrenceVisible, setOccurrenceVisible] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState({});
  const [viewMP, setViewMP] = useState(false);
  const [selectedMP, setSelectedMP] = useState({});
  const [byPatientVisible, setByPatientVisible] = useState(false);
  const [byPatientData, setByPatientData] = useState({});
  const [selectedHour, setSelectedHour] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [type, setType] = useState(false);

  const router = useRouter();
  const hours = Array.from(Array(24).keys());
  const generalLaunchPermission = useUserHasPermission("INT01");
  const medicalPrescriptionPermission = useUserHasPermission("INT02");
  const executePrescriptionPermission = useUserHasPermission("INT03");
  const permissionsDataMenu = {
    medicalPrescriptionPermission,
    generalLaunchPermission,
  };

  const { createToast } = useToast();

  const finalizeHospitalization = useCallback(() => {
    hospitalizationService
      .finalizeHospitalization(selectedPatient?.id)
      .then((_res) =>
        createToast({
          status: "success",
          message: "Hospitalização finalizada com sucesso!",
        })
      )
      .catch((err) =>
        createToast({
          status: "error",
          message: "Houve um erro ao finalizar a hospitalização do paciente",
        })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  }, [selectedPatient?.id]);

  patients.sort((a, b) => {
    if (a.patient.name.toLowerCase() < b.patient.name.toLowerCase()) {
      return -1;
    }

    if (a.patient.name.toLowerCase() > b.patient.name.toLowerCase()) {
      return 1;
    }

    return 0;
  });

  return (
    <Container className="uk-margin-small-top">
      <Row align="bottom">
        <Col span={3}>
          <h3 className="uk-margin-remove">Paciente</h3>
        </Col>
        <Col span={1} className="hour-item uk-text-center">
          Presc. <br />
          Médica
        </Col>
        {hours.map((item, index) => {
          const hourData = moment(new Date())
            .startOf("day")
            .add(index, "hour")
            .format("HH:mm");

          return (
            <Col className="uk-text-center hour-item" flex="auto">
              {hourData} <br />
              {executePrescriptionPermission && (
                <VscTriangleDown
                  className="triangle-icon"
                  onClick={() => {
                    setType("hour");
                    setViewMP(true);
                    setSelectedHour(hourData);
                  }}
                />
              )}
            </Col>
          );
        })}
      </Row>
      {patients.length > 0 &&
        patients.map((item, index) => {
          const { patient } = item;
          const { medicalPrescriptions } = item;
          const { occurrences } = item;

          return (
            <Row key={index}>
              <Col span={3}>
                <PatientBox
                  backgroundNameColor={
                    risks.find((risk) => risk?.id === item?.risk)?.color
                  }
                  textColor={
                    risks.find((risk) => risk?.id === item?.risk)?.textColor
                  }
                >
                  <Dropdown
                    trigger="click"
                    overlay={menu(
                      setFormsVisible,
                      item,
                      router,
                      permissionsDataMenu,
                      false,
                      finalizeHospitalization,
                      setShowControl
                    )}
                    placement="bottom"
                    onClick={() => setSelectedPatient(item)}
                  >
                    <h4
                      className="patient-oc uk-margin-remove"
                      onClick={() => setSelectedPatient(item)}
                    >
                      {patient?.name} <VscTriangleDown /> RG: {patient?.tag}
                    </h4>
                  </Dropdown>

                  <span className="uk-margin-remove">
                    {patient?.patientAnimal?.race?.description}
                  </span>
                  <div className="uk-flex uk-flex-between uk-margin-small-top">
                    <div>
                      <p className="uk-text-muted uk-margin-remove">
                        {item?.type
                          ? types.find((type) => type.id === item?.type).value
                          : "Estado não informado"}
                        <br />
                        Prev. Alta:{" "}
                        {item?.expected_discharge
                          ? moment(item?.expected_discharge).format(
                              "DD/MM/YYYY"
                            )
                          : "Sem data prevista"}
                      </p>
                      <p className="uk-margin-remove">
                        <span className="uk-margin-remove">
                          Internado ha&nbsp;
                          {moment(new Date()).diff(
                            item.created_at,
                            "days"
                          )}{" "}
                          dias
                        </span>
                      </p>
                      {/*
                <p>
                {patient?.raca ? patient?.raca : "NI"} -{" "}
                  {patient?.specie ? patient?.specie : "NI"},{" "}
                  {patient?.yarsOld ? `${patient?.yearsOld}&nbsp;Anos` : "NI"}
                  <br />
                  {item?.status ? item?.status : "Não Informado"} - <br />
                  {item?.risk
                    ? `Situação: ${
                      risks.find((risk) => risk?.id === item?.risk)?.value
                      }`
                    : "Situação Não informada"}
                  <br />
                  {item?.procedimento
                    ? item?.procedimento
                    : "Nenhum procedimento pendente"}
                    </p>
                  */}
                    </div>
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column-reverse",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      {executePrescriptionPermission && (
                        <VscTriangleRight
                          size={40}
                          className="triangle-icon"
                          onClick={() => {
                            setByPatientData({
                              patient: patient,
                              medicalP: medicalPrescriptions,
                              hospitalizationId: item?.id,
                            });
                            setByPatientVisible(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </PatientBox>
              </Col>
              <Col className="calendar-item" span={1}>
                {medicalPrescriptions.map((medicalPrescription, i) => {
                  if (
                    moment(medicalPrescription?.scheduled_at).format(
                      "DD/MM/YYYY"
                    ) === selectedDate &&
                    medicalPrescription?.frequency === "WHEN_NEEDED"
                  ) {
                    return (
                      executePrescriptionPermission && (
                        <BsFillClockFill
                          color={detectClockNonRecurrentColor(
                            medicalPrescription.frequency
                          )}
                          className="prescription-icon"
                          onClick={() => {
                            setType("single");
                            setSelectedMP({
                              ...medicalPrescription,
                              selectedSchedule: {
                                ...medicalPrescription?.scheduling[0],
                                hospitalization: { patient },
                                prescription: {
                                  resume: medicalPrescription?.resume,
                                },
                              },
                            });
                            setSelectedSchedule(false);
                            setSelectedPatient(item);
                            setViewMP(true);
                          }}
                        />
                      )
                    );
                  }
                })}
              </Col>
              {hours.map((hourItem, index) => {
                /*
                const hourData = moment(new Date())
                  .startOf("day")
                  .add(index, "hour")
                  .format("HH:mm");

                const hourActual = moment(new Date()).format("HH");
                */

                return (
                  <Col flex="auto" key={hourItem} className="calendar-item">
                    {/* <Dropdown
                      trigger="click"
                      overlay={menu(
                        setFormsVisible,
                        item,
                        router,
                        permissionsDataMenu,
                        hourItem,
                        false,
                        setShowControl
                      )}
                      placement="bottom"
                      onClick={() => {
                        setSelectedPatient(item);
                      }}
                    >
                      <AiOutlinePlus className="plus-icon" />
                    </Dropdown> */}

                    <Tooltip
                      idTooltip="outlineplus"
                      closeOnClick
                      position="bottom-center"
                      trigger={<AiOutlinePlus onClick={() => setSelectedPatient(item)} className="plus-icon" />}
                      content={menu(
                        setFormsVisible,
                        item,
                        router,
                        permissionsDataMenu,
                        hourItem,
                        false,
                        setShowControl
                      )}
                    ></Tooltip>

                    <div className="uk-flex uk-flex-around">
                      <section className="uk-width-1-3">
                        {occurrences.map((occurrence) => {
                          if (
                            moment(occurrence?.executed_at).format(
                              "DD/MM/YYYY"
                            ) === selectedDate &&
                            parseInt(
                              moment(occurrence?.executed_at).format("HH")
                            ) === hourItem
                          ) {
                            return (
                              executePrescriptionPermission && (
                                <BsFillClockFill
                                  onClick={() => {
                                    setOccurrenceVisible(true);
                                    setSelectedPatient(item);
                                    setSelectedOccurrence(occurrence);
                                  }}
                                  color="orange"
                                  className="occurrence-icon"
                                />
                              )
                            );
                          }
                        })}
                      </section>
                      <section className="uk-width-1-3">
                        {medicalPrescriptions.map((medicalPrescription) => {
                          if (
                            medicalPrescription?.frequency !== "WHEN_NEEDED"
                          ) {
                            return medicalPrescription.scheduling?.map(
                              (scheduling, i) => {
                                if (
                                  moment(scheduling?.scheduled_at).format(
                                    "DD/MM/YYYY"
                                  ) === selectedDate &&
                                  parseInt(
                                    moment(scheduling?.scheduled_at).format(
                                      "HH"
                                    )
                                  ) === hourItem
                                ) {
                                  return (
                                    executePrescriptionPermission && (
                                      <BsFillClockFill
                                        onClick={() => {
                                          setType("single");
                                          setSelectedMP({
                                            ...medicalPrescription,
                                            selectedSchedule: {
                                              ...scheduling,
                                              hospitalization: { patient },
                                              prescription: {
                                                resume:
                                                  medicalPrescription?.resume,
                                              },
                                            },
                                          });
                                          setType("single");
                                          setSelectedPatient(item);
                                          setViewMP(true);
                                        }}
                                        className="prescription-icon"
                                        color={
                                          !scheduling?.executed_at
                                            ? detectClockColor(
                                                scheduling?.scheduled_at,
                                                new Date()
                                              )
                                            : "green"
                                        }
                                      />
                                    )
                                  );
                                }
                              }
                            );
                          }
                        })}
                      </section>
                    </div>
                  </Col>
                );
              })}
            </Row>
          );
        })}
      <ViewOccurrence
        visible={occurrenceVisible}
        setVisible={setOccurrenceVisible}
        occurrenceData={selectedOccurrence}
        patientData={selectedPatient}
        setReload={setReload}
      />
      <ByHour
        reload={reload}
        setReload={setReload}
        visible={viewMP}
        setVisible={setViewMP}
        patientData={patients}
        selectedHour={selectedHour}
        selectedDate={selectedDate}
        type={type}
        medicalPrescription={selectedMP}
      />
      <ByPatient
        reload={reload}
        setReload={setReload}
        visible={byPatientVisible}
        setVisible={setByPatientVisible}
        patientData={byPatientData}
        selectedDate={selectedDate}
      />

      <Modal
        open={!!showControl}
        onClose={() => setShowControl(null)}
        styles={{ maxWidth: "1250px", width: "100%" }}
      >
        <MedicalPrescription id={showControl} />
      </Modal>
    </Container>
  );
});

export default PatientData;
