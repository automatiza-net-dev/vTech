// @ts-nocheck
// Core
import { useRouter } from "next/router";
import * as React from "react";

// Components
import {
  Dropdown,
  Menu,
  Modal,
  Select,
  Tooltip,
  notification,
  Button as AntButton
} from "antd";
import AddBill from "@/OLD/components/Bill/Create";
import AddBudget from "@/OLD/components/Budget/Create";
import { Button } from "@/OLD/components/mini-components/Button";
import {
  AddDocuments,
  AddExam,
  AddMedicalRecipe,
  AddNotes,
  AddPatologies,
  AddPhotos,
  AddVaccines,
  AddWeight,
  Attendance,
  Hospitalization
} from "../Forms-old";
import { Container, InputOverflow } from "./styles";
const { Option } = Select;
import { Edit as EditPatient } from "@/OLD/components/Patient/Edit";
import { Edit as EditTutor } from "@/OLD/components/Tutor/Edit";

// Services
import { scheduleDetailsService } from "@/OLD/services/scheduleDetails.service";
import { attendanceService } from "@/OLD/services/attendances.service.ts";

// Hooks
import { useAuth } from "@/OLD/hooks/useAuth";
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { useHospitalizations } from "@/OLD/hooks/useHospitalizations";
import { usePatientMetadata } from "@/OLD/hooks/usePatientMetadata";
import { useScheduleStatus } from "@/OLD/hooks/useScheduleStatus";
import { useSchedule } from "@/OLD/hooks/useSchedules";
import { useAttendances } from "@/OLD/hooks/useAttendances";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Icons
import { Dna } from "@styled-icons/boxicons-regular/Dna";
import { Plus } from "@styled-icons/boxicons-regular/Plus";
import { PlusMedical } from "@styled-icons/boxicons-regular/PlusMedical";
import { DonateBlood } from "@styled-icons/boxicons-solid/DonateBlood";
import { User } from "@styled-icons/boxicons-solid/User";
import { Videos } from "@styled-icons/boxicons-solid/Videos";
import { FileMedical } from "@styled-icons/fa-solid/FileMedical";
import { BriefcaseMedical } from "@styled-icons/fluentui-system-filled/BriefcaseMedical";
import { CalendarAssistant } from "@styled-icons/fluentui-system-filled/CalendarAssistant";
import { Document } from "@styled-icons/fluentui-system-filled/Document";
import { DocumentOnePage } from "@styled-icons/fluentui-system-filled/DocumentOnePage";
import { Whatsapp } from "@styled-icons/remix-fill/Whatsapp";
import { BsDoorOpen } from "react-icons/bs";
import { FaBalanceScaleLeft, FaCross } from "react-icons/fa";
import { GiSiren } from "react-icons/gi";
import { TbZoomMoney } from "react-icons/tb";

// Utils
import Masks from "@/OLD/utils/masks";
import { convertToAge } from "@/OLD/utils/generalUtils";
import PatientBudgets from "../Timeline/PatientBudgets";
import DeathForm from "@/OLD/components/Attendance/Forms-old/Death";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

const menu = (
  setObj,
  cashiers = false,
  systemName,
  selectedHour = false,
  permissions
) => {
  const { addLaunchPermission, launchBillPermission, launchBudgetPermission } =
    permissions;

  return (
    <Menu
      items={[
        addLaunchPermission && {
          key: "1",
          label: (
            <span>
              <PlusMedical size={15} />{" "}
              {systemName === "LiftOne" ? "Avaliação" : "Atendimento"}
            </span>
          ),
          onClick: () => setObj({ addAttendance: true })
        },
        addLaunchPermission && {
          key: "2",
          label: (
            <span>
              <Document size={15} /> Documento
            </span>
          ),
          onClick: () => setObj({ addDocuments: true })
        },
        addLaunchPermission && {
          key: "3",
          label: (
            <span>
              <BriefcaseMedical size={15} /> Exame
            </span>
          ),
          onClick: () => setObj({ addExam: true })
        },
        addLaunchPermission && {
          key: "4",
          label: (
            <span>
              <Videos size={15} /> Fotos e vídeos
            </span>
          ),
          onClick: () => setObj({ addPhotoVideo: true })
        },
        addLaunchPermission && {
          key: "15",
          label: (
            <span>
              <FaCross size={15} /> Óbito
            </span>
          ),
          onClick: () => {
            setObj({
              visible: true,
              formTitle: "Óbito",
              report: "Relatório do Óbito",
              formType: "deathReport",
              selectedHour
            });
          }
        },
        addLaunchPermission &&
          systemName === "LiftOne" && {
            key: "5",
            label: (
              <span>
                <DonateBlood size={15} /> Glicemia
              </span>
            ),
            onClick: () => setObj({ glycemia: true })
          },
        addLaunchPermission && {
          key: "6",
          label: (
            <span>
              {" "}
              <DocumentOnePage size={15} /> Observação{" "}
            </span>
          ),
          onClick: () => setObj({ addNote: true })
        },
        launchBudgetPermission && {
          key: "7",
          label: (
            <span>
              {" "}
              <TbZoomMoney size={15} /> Orçamento{" "}
            </span>
          ),
          onClick: () => setObj({ budget: true })
        },
        addLaunchPermission && {
          key: "8",
          label: (
            <span>
              <Dna size={15} /> Patologia
            </span>
          ),
          onClick: () => setObj({ addPatology: true })
        },
        addLaunchPermission && {
          key: "9",
          label: (
            <span>
              {" "}
              <FaBalanceScaleLeft size={15} /> Peso{" "}
            </span>
          ),
          onClick: () => setObj({ addWeight: true })
        },
        systemName === "LiftOne" &&
          addLaunchPermission && {
            key: "10",
            label: (
              <span>
                <img src="/svg/blood-pressure.svg" width="15" /> Pressão
                Arterial
              </span>
            ),
            onClick: () => setObj({ bloodPressure: true })
          },
        systemName !== "LiftOne" &&
          addLaunchPermission && {
            key: "11",
            label: (
              <span>
                <User size={15} /> Tutor
              </span>
            ),
            onClick: () => setObj({ addTutor: true })
          },
        addLaunchPermission && {
          key: "12",
          label: (
            <span>
              {" "}
              <FileMedical size={15} /> Receita{" "}
            </span>
          ),
          onClick: () => setObj({ addRecipe: true })
        },
        systemName !== "LiftOne" &&
          addLaunchPermission && {
            key: "13",
            label: (
              <span>
                {" "}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2212/2212190.png"
                  width="15"
                />{" "}
                Vacina
              </span>
            ),
            onClick: () => setObj({ addVaccine: true })
          },
        launchBillPermission && {
          key: "14",
          label: (
            <span>
              {" "}
              <TbZoomMoney size={15} /> Venda{" "}
            </span>
          ),
          onClick: () => {
            if (cashiers.length === 0) {
              return notification.warning({
                message: "Nenhum caixa diário aberto"
              });
            }
            setObj({ bill: true });
          }
        }
      ]}
    />
  );
};

const formatGenderLabel = (str) => (str === "male" ? "Macho" : "Fêmea");

function AttendanceHeader({
  patient,
  reload,
  setReload,
  setReloadExtern
}) {
  const [formsVisible, setFormsVisible] = React.useState({});
  const [showSelectAttendances, setShowSelectAttendances] =
    React.useState(false);
  const [activeTutor, setActiveTutor] = React.useState({});
  const [attendancesToClose, setAttendancesToClose] = React.useState([]);
  const [selectedAttendance, setSelectedAttendance] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({});
  const [editPetVisible, setEditPetVisible] = React.useState(false);
  const [editTutorVisible, setEditTutorVisible] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(false);

  const router = useRouter();
  const scheduleId = router.query.innerpage;

  const { scheduleStatus } = useScheduleStatus();
  const { schedule } = useSchedule(scheduleId, reload);
  const { hospitalizations } = useHospitalizations();
  const { metadata } = usePatientMetadata(patient?.id);
  const { attendances } = useAttendances(patient?.id, reload);
  const { setPetToVinc } = useAuth();
  const { cashiers } = useDailyCasher(false, filters);
  
  const systemName = process.env.clientName;
  const years = moment(new Date()).diff(patient?.birth_date, "years", true);

  const addLaunchPermission = useUserHasPermission("FIC01");
  const launchBillPermission = useUserHasPermission("FIC02");
  const launchBudgetPermission = useUserHasPermission("FIC03");
  const hospitalizationPermission = useUserHasPermission("FIC04");

  const confirmArrivedPermission = useUserHasPermission("AGE06");
  const endSchedulingPermission = useUserHasPermission("AGE07");

  const permissionsData = {
    addLaunchPermission,
    launchBillPermission,
    launchBudgetPermission
  };

  const findPatient = hospitalizations?.find(
    (hospitalization) => hospitalization?.patient?.id === patient?.id
  );

  const closeAttendances = React.useCallback(() => {
    setLoading(true);
    attendanceService
      .closeAttendance(selectedAttendance)
      .then((_res) =>
        notification.success({ message: "Atendimento finalizado com sucesso!" })
      )
      .finally(() => {
        setLoading(false);
        setSelectedAttendance(false);
        setReload((prv) => !prv);
        setShowSelectAttendances(false);
      });
  }, [selectedAttendance]);

  const filterAttendances = () => {
    setAttendancesToClose(
      attendances.filter((attendance) => !attendance?.end_date)
    );
  };

  React.useEffect(() => {
    filterAttendances();
    attendancesToClose?.length === 1 &&
      setSelectedAttendance(attendances[0]?.id);
  }, [attendances]);

  React.useEffect(() => {
    setActiveTutor(patient?.tutors?.find((tutor) => tutor?.is_main));
  }, [patient]);

  React.useEffect(() => {
    setFilters({
      from: moment(new Date()).startOf("day"),
      to: moment(new Date()).endOf("day"),
      status: "ABERTO"
    });
  }, []);

  React.useEffect(() => {
    if (formsVisible?.addTutor) {
      setPetToVinc(patient?.id);
      router.push(`/dashboard/tutor`);
    }
  }, [formsVisible?.addTutor]);

  const changeStatus = () => {
    scheduleDetailsService
      .changeStatus({
        scheduleId,
        statusId: scheduleStatus.find((item) =>
          item.description.includes("Na recepção")
        )?.id
      })
      .then((_res) =>
        notification.success({
          message: "Chegada informada"
        })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  };

  const completeSchedule = () => {
    scheduleDetailsService
      .changeStatus({
        scheduleId,
        statusId: scheduleStatus.find((item) =>
          item.description.includes("Atendimento finalizado")
        )?.id
      })
      .then((_res) =>
        notification.success({
          message: "Agendamento finalizado"
        })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  };

  const detectArriveButton = () => {
    if (
      !scheduleId ||
      schedule?.serviceStatus?.description !== "Agendado (Confirmado)"
    ) {
      return true;
    }
  };

  return (
    <>
      <Container className="uk-flex-around main-container uk-padding-small">
        <div className="uk-flex uk-flex-between">
          <section className="uk-margin-small-right">
            <img
              src={`${process.env.NEXT_PUBLIC_API}${patient?.photo}`}
              alt="pet-avatar"
              id="avatar-header"
              onError={() => {
                const imageElement = document.querySelector("#avatar-header");

                if (process.env.client === "liftone") {
                  return (imageElement.src =
                    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg");
                } else {
                  return (imageElement.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnr0cXPGQV9g1WCJydjx3jxawvD6wS52PaMQ&usqp=CAU");
                }
              }}
            />
          </section>
          <section>
            <div>
              <h2 className="uk-margin-remove">
                <Tooltip
                  title={`Clique para editar dados do ${
                    process.env.client === "liftone" ? "cliente" : "paciente"
                  }`}
                >
                  <span
                    className="uk-link"
                    onClick={() => {
                      setSelectedId(patient.id);
                      if (process.env.client !== "liftone") {
                        setEditPetVisible(true);
                      } else {
                        setEditTutorVisible(true);
                      }
                      /*
                      systemName !== "LiftOne"
                      ? router.push(
                        `/dashboard/paciente/editar/${patient?.id}`
                        )
                        : router.push(`/dashboard/tutor/editar/${patient?.id}`);
                        */
                    }}
                  >
                    {patient?.name}
                  </span>
                </Tooltip>
              </h2>
            </div>
            {process.env.client === "liftone" && (
              <>
                <div>
                  <div className="uk-margin-remove">Telefone:</div>
                  <div className="uk-margin-remvoe">
                    {Masks?.phone(String(patient?.tutor?.cellphone))}
                  </div>
                </div>
                <div>
                  <div className="uk-margin-remove">E-mail:</div>
                  <div className="uk-margin-remove">
                    {patient?.tutor?.email}
                  </div>
                </div>
              </>
            )}
            {process.env.client !== "liftone" && (
              <>
                <section className="uk-text-muted uk-margin-small-top">
                  RG {patient?.tag}
                </section>
                <InputOverflow>{patient?.tags}</InputOverflow>
              </>
            )}
          </section>
        </div>
        {process.env.client === "liftone" && (
          <div className="uk-flex uk-flex-column">
            <div>
              <div className="uk-margin-remove">Hipertensão:</div>
              <div className="uk-margin-remove">
                {patient?.pressure ? "Sim" : "Não"}
              </div>
            </div>
            <div>
              <div className="uk-margin-remove">Diabetes:</div>
              <div className="uk-margin-remove">
                {patient?.diabetes ? "Sim" : "Não"}
              </div>
            </div>
          </div>
        )}
        {process.env.client !== "liftone" && (
          <>
            <div className="uk-flex uk-flex-around uk-width-1-2">
              <section>
                <div className="inf-box uk-margin-right">
                  <h4 className="uk-margin-remove">Raça</h4>
                  <p className="uk-margin-remove">
                    {`${patient?.patientAnimal?.race?.specie?.description} > ${patient?.patientAnimal?.race?.description}`}
                  </p>
                </div>
                <div className="inf-box uk-margin-top">
                  <h4 className="uk-margin-remove">Sexo</h4>
                  <p className="uk-margin-remove">
                    {formatGenderLabel(patient?.gender)}
                  </p>
                </div>
                <div className="uk-margin-top">
                  <h4 className="uk-margin-remove">Vendas em aberto</h4>
                  <h5 className="uk-margin-remove">
                    {currencyFormatter(metadata?.missingFromBills)}
                  </h5>
                </div>
              </section>
              <section>
                <div className="inf-box">
                  <h4 className="uk-margin-remove">Peso</h4>
                  <p className="uk-margin-remove">{patient?.weight}Kg</p>
                </div>
                <div>
                  <div className="inf-box uk-margin-top">
                    <h4 className="uk-margin-remove">Idade</h4>
                    <p className="uk-margin-remove">{convertToAge(years)}</p>
                  </div>
                  {patient?.patientAnimal?.death && (
                    <div className="inf-box uk-margin-top">
                      <p className="uk-margin-remove red-alert">
                        <h4 className="uk-margin-remove red-alert">
                          Óbito em:
                        </h4>
                        {moment(patient?.patientAnimal?.death_date).format(
                          "DD/MM/YYYY - HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </section>
              <section>
                <div className="inf-box">
                  <h4 className="uk-margin-remove">Tutor Ativo</h4>
                  <p className="uk-margin-remove">
                    {patient?.tutors?.length > 0 && (
                      <Tooltip title="clique para editar os dados do tutor">
                        <span
                          className="uk-link tutor-name"
                          onClick={() => {
                            setSelectedId(activeTutor?.id);
                            setEditTutorVisible(true);
                          }}
                        >
                          {activeTutor?.name}
                        </span>
                      </Tooltip>
                    )}
                  </p>
                  <div className="uk-margin-small-top">
                    <p className="uk-margin-remove">
                      {activeTutor?.tutor?.cellphone
                        ? Masks.phone(activeTutor?.tutor?.cellphone)
                        : "Telefone não informado"}{" "}
                      <Whatsapp size={15} />
                    </p>
                    <p className="uk-margin-remove">
                      {activeTutor?.tutor?.email
                        ? activeTutor?.tutor?.email
                        : "Email não informado"}
                    </p>
                  </div>
                </div>
              </section>
              {/*
          <section>
          <div className="inf-box">
              <h4>Contatos</h4>
              patient
            </div>
            </section>
          */}
            </div>
          </>
        )}
        <AddWeight
          visible={formsVisible?.addWeight}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
          type={"Peso"}
        />
        <AddWeight
          visible={formsVisible?.glycemia}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
          type={"Glicemia"}
        />
        <AddWeight
          visible={formsVisible?.bloodPressure}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
          type={"Pressão arterial"}
        />
        <AddDocuments
          visible={formsVisible?.addDocuments}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddMedicalRecipe
          visible={formsVisible?.addRecipe}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddPatologies
          visible={formsVisible?.addPatology}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddPhotos
          visible={formsVisible?.addPhotoVideo}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddNotes
          visible={formsVisible?.addNote}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddVaccines
          visible={formsVisible?.addVaccine}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <AddExam
          visible={formsVisible?.addExam}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        <Hospitalization
          patient={patient}
          visible={formsVisible?.hospitalizationVisible}
          setVisible={setFormsVisible}
          reload={reload}
          setReload={setReload}
        />
        <Attendance
          visible={formsVisible?.addAttendance}
          setVisible={setFormsVisible}
          patient={patient}
          reload={reload}
          setReload={setReload}
        />
        {formsVisible?.budget && (
          <AddBudget
            visible={formsVisible?.budget}
            close={setFormsVisible}
            clientData={patient}
            setReloadExtern={setReloadExtern}
          />
        )}
        {formsVisible?.bill && (
          <AddBill
            visible={formsVisible?.bill}
            close={setFormsVisible}
            clientData={patient}
            setReloadExtern={setReloadExtern}
          />
        )}
        <DeathForm
          open={formsVisible?.formType === "deathReport"}
          close={() => setFormsVisible({})}
          patient={patient}
        />

        <section className="buttons-container">
          <div className="uk-margin-small-top uk-width-1-1 uk-flex">
            {systemName !== "LiftOne" && hospitalizationPermission && (
              <Button
                theme="danger"
                classCallback="uk-width-1-2 uk-margin-small-right"
                onClick={() => {
                  !findPatient
                    ? setFormsVisible({ hospitalizationVisible: true })
                    : router.push("/dashboard/internacao");
                }}
              >
                <GiSiren size={25} />
                &nbsp;Internação
              </Button>
            )}
            {!confirmArrivedPermission && (
              <Button
                classCallback="uk-text-center uk-text-small uk-width-2-3 uk-margin-small-right"
                disabled={detectArriveButton()}
                onClick={() => {
                  !detectArriveButton() && changeStatus();
                }}
              >
                <User size={15} /> Informar Chegada paciente
              </Button>
            )}
          </div>
          <div className="uk-margin-small-top uk-width-1-1 uk-flex">
            <Button
              classCallback="uk-width-1-2 uk-margin-small-right"
              onClick={() => router.push("/dashboard/agenda")}
            >
              <CalendarAssistant size={20} />
              &nbsp; Agenda
            </Button>
            {addLaunchPermission && (
              <Button
                classCallback="uk-text-center uk-text-small uk-width-2-3 uk-margin-small-right"
                style={{ gap: "0.25rem" }}
                onClick={() => {
                  if (attendancesToClose?.length > 0) {
                    setShowSelectAttendances(true);
                  } else {
                    Modal.confirm({
                      title: "Finalizar agendamento",
                      content:
                        "Não há atendimentos pendentes para o paciente. Deseja finalizar o agendamento?",
                      onOk: () => {
                        if (
                          schedule?.serviceStatus?.description ===
                          "Em atendimento"
                        ) {
                          const attendancesToClose = attendances?.find(
                            (attendance) => !attendance?.end_date
                          );

                          attendancesToClose &&
                            attendanceService
                              .closeAttendance(attendancesToClose?.id)
                              .then((_res) =>
                                notification.success({
                                  message: "Atendimento finalizado com sucesso!"
                                })
                              );
                        }

                        changeStatus({
                          scheduleId,
                          statusId: schedule?.schedule_status_id
                        });
                      },
                      onCancel: () => {
                        // Handle the cancel event if needed
                        // ...
                      }
                    });
                  }
                }}
              >
                <BsDoorOpen size={20} /> Finalizar atendimento
              </Button>
            )}
          </div>
          <section className="uk-margin-small-top">
            <div className="uk-margin-large-right" style={{ gap: "0.5rem" }}>
              <Dropdown
                overlay={menu(
                  setFormsVisible,
                  cashiers,
                  systemName,
                  selectedHour,
                  permissionsData
                )}
                placement="bottom"
              >
                <Button classCallback="uk-width-1-2">
                  <Plus size={20} />
                  &nbsp;Adicionar
                </Button>
              </Dropdown>
            </div>
            <></>
          </section>
        </section>
        <Modal
          onCancel={() => setShowSelectAttendances(false)}
          title="Fechar atendimento"
          visible={showSelectAttendances}
          footer={null}
          width={"60%"}
        >
          <div>
            <label>Selecione o atendimento a ser fechado</label>
            <Select
              onChange={(val) => setSelectedAttendance(val)}
              className="uk-width-1-1"
              value={selectedAttendance}
            >
              {attendancesToClose?.length > 0 &&
                attendancesToClose
                  .slice() // Faz uma cópia do array original para evitar alterações indesejadas
                  .sort(
                    (a, b) => new Date(a.start_date) - new Date(b.start_date)
                  )
                  .map((attendance) => (
                    <Option value={attendance?.id}>
                      {attendance?.scheduleService?.description}
                      {" - "}
                      {moment(attendance.start_date).format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                    </Option>
                  ))}
            </Select>
          </div>
          <hr />
          <footer className="uk-flex uk-flex-right">
            <AntButton
              className="uk-margin-right"
              type="primary"
              loading={loading}
              onClick={() => {
                !selectedAttendance
                  ? notification.warning({
                      message: "Selecione o atendimento a ser finalizado"
                    })
                  : closeAttendances();
              }}
            >
              Confirmar
            </AntButton>
            <AntButton onClick={() => setShowSelectAttendances(false)}>
              Cancelar
            </AntButton>
          </footer>
        </Modal>
      </Container>
      {findPatient && systemName !== "LiftOne" && (
        <div className="uk-flex uk-flex-around uk-margin-top">
          <h4 className="uk-margin-remove">
            <strong>Internado</strong>
          </h4>
        </div>
      )}
      {editPetVisible && (
        <Modal
          visible={editPetVisible}
          width={1200}
          onCancel={() => setEditPetVisible(false)}
          footer={null}
        >
          <EditPatient setVisible={setEditPetVisible} id={selectedId} />
        </Modal>
      )}
      {editTutorVisible && (
        <Modal
          visible={editTutorVisible}
          width={1200}
          onCancel={() => setEditTutorVisible(false)}
          footer={null}
        >
          <EditTutor setVisible={setEditTutorVisible} tutorId={selectedId} />
        </Modal>
      )}
    </>
  );
};

export default AttendanceHeader;
