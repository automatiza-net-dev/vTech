// @ts-nocheck
import { Table, Tag } from "antd";
import Link from "next/link";
import ActiveTutorsForm from "../ActiveTutorsForm";
import { useEffect, useState } from "react";
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "../Delete";
import { columns, customColumns, opportunitiesColumns } from "./columns";

import { usePatients } from "@/OLD/hooks/usePatients";

// Components
import { Container } from "./styles";
import { Button } from "infinity-forge";
import PatientDetails from "../../../../presentation/pages/dashboard/paciente/patient-info/patient-info";
import { Edit } from "../Edit";

// Utils
import TutorVincForm from "./TutorVincForm";
import { FormCreatePatient, SchedulingContextProvider } from "@/presentation";
import { Icon, useToast, Modal } from "infinity-forge";
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
  const [refreshList, setRefreshList] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTutorOpen, setActiveTutorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [patient, setPatient] = useState<any>("");
  const [patientSelected, setPatientSelected] = useState("");
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
              gender: patient.gender,
              birthDate: patient?.birthDate
                ? convertDate(patient.birthDate)
                : "-",
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
                    refresh={() => setRefreshList((prv) => !prv)}
                  />
                  &nbsp;
                  <span
                    className="uk-link"
                    onClick={() => {
                      setActiveTutorOpen(true);
                      setPatient(patient);
                    }}
                  >
                    Selecionar responsável ativo
                  </span>
                </>
              ),
              race:
                patient?.race?.specie?.description && patient?.race?.description
                  ? `${patient?.race?.specie?.description} > ${patient?.race?.description}`
                  : "-",
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
                      trigger={<Icon name="IconEdit" color="#000" />}
                      onSuccess={() => setRefreshList((prv) => !prv)}
                    />
                  )}
                </div>
              ),
              schedule: (
                <Button
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
                  text="Agendar"
                />
              ),
              opportunity: (
                <Button
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
                      castrated: patient?.castrated || "false",
                      weight: patient?.weight,
                      contact: { tutor },
                    }));
                    setVisible(false);
                  }}
                  text="Criar oportunidade"
                />
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
          O responsável ativo será o responsável dentro do atendimento{" "}
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
        styles={{ width: "800px", padding: "20px" }}
        open={activeTutorOpen}
        onClose={() => setActiveTutorOpen(false)}
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
          open={detailsVisible}
          onClose={() => setDetailsVisible(false)}
          styles={{ width: 1200 }}
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
          styles={{ width: 1200 }}
          onClose={() => setEditVisible(false)}
          open={editVisible}
        >
          <Edit id={selectedId} setVisible={setEditVisible} />
        </Modal>
      )}
    </Container>
  );
}
