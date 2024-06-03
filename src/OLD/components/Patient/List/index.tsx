// @ts-nocheck
import { Table, Tag, Modal } from "antd";
import Link from "next/link";
import ActiveTutorsForm from "../ActiveTutorsForm";
import { memo, useCallback, useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";
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
import { PlusSquare } from "@styled-icons/bootstrap/PlusSquare";

// Utils
import TutorVincForm from "./TutorVincForm";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

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
  const [loading, setLoading] = useState();
  const [refreshList, setRefreshList] = useState();
  const [data, setData] = useState(null);
  const [activeTutorOpen, setActiveTutorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [patient, setPatient] = useState("");
  const [patientSelected, setPatientSelected] = useState("");
  const [newTutorOpen, setNewTutorOpen] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const { patients } = usePatients(internReload, filters);

  const canEditPet = useUserHasPermission("PET02");
  const canDeletePet = useUserHasPermission("PET03");

  const handleCreateTable = () => {
    patients?.length > 0
      ? setData(
          patients?.map((patient) => {
            return {
              name: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="uk-link"
                    onClick={() => {
                      setDetailsVisible(true);
                      setSelectedId(patient?.id);
                    }}
                  >
                    {patient.name}
                  </span>
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
                  {patient.tutors.length > 0 &&
                    patient.tutors.map((item) =>
                      item?.isMain ? (
                        <strong>{item?.name}&nbsp;|&nbsp;</strong>
                      ) : (
                        <span>{item?.name}&nbsp;|&nbsp;</span>
                      )
                    )}
                  <PlusSquare
                    size={20}
                    className="add-icon"
                    onClick={() => {
                      setPatientSelected(patient);
                      setNewTutorOpen(true);
                    }}
                  />
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
                <Link href={`/dashboard/atendimento/${patient?.id}`}>
                  <Tag color="gray" style={{ cursor: "pointer" }}>
                    Ficha paciente
                  </Tag>
                </Link>
              ),
              actions: (
                <div className="uk-flex" style={{ gap: "20px" }}>
                  {canEditPet && (
                    <EditTwoTone
                      className=""
                      onClick={() => {
                        setSelectedId(patient.id);
                        setEditVisible(true);
                      }}
                    />
                  )}
                  {canDeletePet && (
                    <Delete
                      id={patient.id}
                      setRefreshList={() => setRefreshList(!refreshList)}
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
                    const tutor = patient.tutors.find((item) => item?.isMain);

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
  }, [
    refreshList,
    internReload,
    canEditPet,
    canDeletePet,
    querySchedule,
    filters,
    patients,
  ]);

  return (
    <Container>
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
        loading={loading}
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
