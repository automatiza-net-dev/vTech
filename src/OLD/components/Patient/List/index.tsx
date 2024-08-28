// @ts-nocheck
import { Table, Tag, Modal } from "antd";
import Link from "next/link";
import ActiveTutorsForm from "../ActiveTutorsForm";
import { useEffect, useState } from "react";
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "../Delete";
import { columns, customColumns, opportunitiesColumns } from "./columns";

import { usePatients } from "@/OLD/hooks/usePatients";

// Components
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import PatientDetails from "../Single/Details";
import { Edit } from "../Edit";

// Icons
import { EditTwoTone } from "@ant-design/icons";

// Utils
import TutorVincForm from "./TutorVincForm";
import { FormCreatePatient, SchedulingContextProvider } from "@/presentation";
import { Icon, useToast } from "infinity-forge";
import { AddTutor } from "@/presentation/pages/dashboard/scheduling/context/components/modal-set-patients/form-set-patients/table/table-configurations/tutors/add-tutor";

export function PatientList({
  filters,
  modal = false,
  internReload = false,
  setPayload = false,
  setDrawerIsOpen = false,
  setVisible = false,
  setSearch = false,
  patientListVisible = false,
  querySchedule,
  origin = false,
}) {
  const [refreshList, setRefreshList] = useState();
  const [data, setData] = useState<any>(null);
  const [activeTutorOpen, setActiveTutorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [patient, setPatient] = useState<any>("");
  const [patientSelected, setPatientSelected] = useState("");
  const [newTutorOpen, setNewTutorOpen] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const { patients } = usePatients(internReload, refreshList, filters);
  const { createToast } = useToast();

  // const canDeletePet = useUserHasPermission("PET03");

  const handleCreateTable = () => {
    patients?.length > 0
      ? setData(
          patients?.map((patient: any, index) => {
            return {
              name: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {patient.name ? (
                    <span
                      className="uk-link"
                      onClick={() => {
                        if (!patient.name) {
                          return;
                        }
                        setDetailsVisible(true);
                        setSelectedId(patient?.id);
                      }}
                    >
                      {patient.name || "Sem paciente vinculado"}
                    </span>
                  ) : (
                    <FormCreatePatient
                      isModal
                      patientId={patient.id !== "-" ? patient.id : ""}
                      initialDataForm={{ holders: patient.tutors }}
                      trigger={
                        <span className="uk-link">
                          {"Sem paciente vinculado"}
                        </span>
                      }
                    />
                  )}
                </div>
              ),
              tag: patient.tag ?? "-",
              gender: patient.gender
                ? patient.gender === "male"
                  ? "Macho"
                  : "Fêmea"
                : "Gênero não informado",
              birthDate: convertDate(patient.birthDate),
              tutors: (
                <>
                  {patient?.tutors?.length > 0 &&
                    patient?.tutors?.map((item) =>
                      item?.isMain ? (
                        <strong>{item?.name}&nbsp;|&nbsp;</strong>
                      ) : (
                        <span>{item?.name}&nbsp;|&nbsp;</span>
                      )
                    )}
                  <AddTutor
                    id={patient?.id}
                    tutors={patient?.tutors}
                    origin="Cadastro"
                  />
                  {/* <svg
                    viewBox="0 0 16 16"
                    height="20"
                    width="20"
                    focusable="false"
                    role="img"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="add-icon"
                    onClick={() => {
                      setPatientSelected(patient);
                      setNewTutorOpen(true);
                    }}
                  >
                    <title>PlusSquare icon</title>
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                  </svg> */}
                  &nbsp;
                  <span
                    className="uk-link"
                    onClick={() => {
                      setActiveTutorOpen(true);
                      setPatient(patient);
                    }}
                  >
                    Selecionar tutor ativo
                  </span>
                </>
              ),
              race:
                patient?.race?.specie?.description && patient?.race?.description
                  ? `${patient?.race?.specie?.description} > ${patient?.race?.description}`
                  : "Raça não informado",
              attendance: (
                <div>
                  {patient?.name ? (
                    <div>
                      <Link href={`/dashboard/paciente/${patient?.id}`}>
                        <Tag color="gray" style={{ cursor: "pointer" }}>
                          Ficha paciente
                        </Tag>
                      </Link>
                    </div>
                  ) : (
                    <div>-----</div>
                  )}
                </div>
              ),
              community: patient.community ? "Sim" : "Não",
              actions: (
                <div className="uk-flex" style={{ gap: "20px" }}>
                  {patient?.name && (
                    <FormCreatePatient
                      isModal
                      patientId={patient.id}
                      trigger={<Icon name="IconEdit" fill="#000" />}
                    />
                  )}
                </div>
              ),
              schedule: (
                <CustomButton
                  onClick={() => {
                    setPayload((prv) => {
                      return {
                        ...prv,
                        tutor_id: patient.tutors.find((item) => item?.isMain)
                          ?.id,
                        patient_id: patient?.id,
                        tutorName: patient.tutors.find((item) => item?.isMain)
                          ?.name,
                        patientName: patient?.name,
                      };
                    });
                    setDrawerIsOpen(patientListVisible);
                    setVisible(false);
                  }}
                >
                  Agendar
                </CustomButton>
              ),
              opportunity: (
                <CustomButton
                  onClick={() => {
                    const tutor =
                      patient.tutors.find((item) => item?.isMain) ||
                      patient.tutors[0];

                    setPayload((prv) => ({
                      ...prv,
                      clientId: patient?.id,
                      tutorName: tutor?.name,
                      contactId: tutor?.id,
                      patientName: patient?.name,
                      raceId: patient?.race?.id,
                      raceDescription: patient?.race?.description,
                      gender: patient?.gender,
                      castrated: `${patient?.castrated}`,
                      weight: patient?.weight,
                      contact: { tutor },
                    }));
                    setVisible(false);
                  }}
                >
                  criar oportunidade
                </CustomButton>
              ),
            };
          })
        )
      : setData([]);
  };

  useEffect(() => {
    handleCreateTable();
  }, [refreshList, internReload, querySchedule, filters, patients]);

  return (
    <Container>
      {modal && (
        <p className="uk-margin-remove">
          {" "}
          O tutor ativo será o tutor responsável dentro do atendimento{" "}
        </p>
      )}
      <Table
        columns={
          !modal
            ? columns
            : origin === "opportunities"
            ? opportunitiesColumns
            : customColumns
        }
        dataSource={Object.keys(filters).length === 0 ? [] : data}
        locale={{
          emptyText:
            Object.keys(filters).length === 0 ? (
              <>Pesquise acima para exibir o resultado</>
            ) : (
              <>Nenhum resultado encontrado</>
            ),
        }}
      />

      <Modal
        title="Vincular tutor"
        visible={newTutorOpen}
        footer={null}
        onCancel={() => {
          setPatient("");
          setNewTutorOpen(false);
        }}
      >
        <TutorVincForm
          visible={newTutorOpen}
          reload={refreshList}
          setReload={setRefreshList}
          patient={patientSelected}
          setVisible={setNewTutorOpen}
          isButtonCreateTutor={true}
          querySchedule={querySchedule}
        />
      </Modal>
      <Modal
        title="Selecionar tutor ativo"
        visible={activeTutorOpen}
        onCancel={() => setActiveTutorOpen(false)}
        footer={null}
      >
        <ActiveTutorsForm
          patient={patient}
          setVisible={setActiveTutorOpen}
          refreshList={refreshList}
          setRefreshList={setRefreshList}
        />
      </Modal>
      {PatientDetails && (
        <Modal
          visible={detailsVisible}
          footer={null}
          onCancel={() => setDetailsVisible(false)}
          width={1200}
        >
          <PatientDetails
            selectedId={selectedId}
            setVisible={setDetailsVisible}
            setEditVisible={setEditVisible}
          />
        </Modal>
      )}
      {editVisible && (
        <Modal
          width={1200}
          footer={null}
          onCancel={() => setEditVisible(false)}
          visible={editVisible}
        >
          <Edit id={selectedId} setVisible={setEditVisible} />
        </Modal>
      )}
    </Container>
  );
}
