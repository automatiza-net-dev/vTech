// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import { petsService } from "@/OLD/services/patient.service";

// Hooks
import { useAuth } from "@/OLD/hooks/useAuth";
import { useTutor } from "@/OLD/hooks/useTutor";
import { usePatients } from "@/OLD/hooks/usePatients";

// Icons
import { EditTwoTone } from "@ant-design/icons";

import { GiConfirmed } from "react-icons/gi";

// Components
import { Delete } from "../Delete";
import { Container } from "./styles";
import {
  Tag,
  Tooltip,
  notification,
  Table,
  Modal,
  Dropdown,
  Menu,
  AutoComplete,
} from "antd";
import { Single } from "../Single";
import { Edit } from "../Edit";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import Masks from "@/OLD/utils/masks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { FormCreatePatient, FormCreateTutor } from "@/presentation";
import { Icon, Modal as InfinityForgeModal, Button } from "infinity-forge";

export function List({
  filters,
  tutors = false,
  patient = false,
  setPatientReload = false,
  modal = false,
  setPayload = false,
  setDrawerIsOpen = false,
  setVisible = false,
  setSearch = false,
  patientListVisible = false,
  querySchedule,
  origin = false,
  setReload,
  reload,
  setFilters,
}: any) {
  const [petToVinc, setPetToVinc] = useState(false);

  const canEditTutor = useUserHasPermission("TUT02");
  const canDeleteTutor = useUserHasPermission("TUT03");
  const canCreatePet = useUserHasPermission("PET01");

  const [data, setData] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [vincPetVisible, setVincPetVisible] = useState(false);
  const [createPetVisible, setCreatePetVisible] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(false);
  const [selectedPetToVinc, setSelectedPetToVinc] = useState(null);

  const { tutors: tutorsList, loading } = useTutor(filters, reload);
  const { patients } = usePatients(false, false, vincPetVisible);

  const router = useRouter();

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Celular",
      dataIndex: "cellphone",
      key: "cellphone",
    },
    {
      title: "Pets",
      dataIndex: "dependents",
      key: "dependents",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const liftColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Celular",
      dataIndex: "cellphone",
      key: "cellphone",
    },
    {
      title: "Diabetes",
      dataIndex: "diabetes",
      key: "diabetes",
    },
    {
      title: "Hipertensão",
      dataIndex: "hypertension",
      key: "hypertension",
    },
    {
      title: "Ficha Paciente",
      dataIndex: "attendance",
      key: "attendance",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const crmLiftoneColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Celular",
      dataIndex: "cellphone",
      key: "cellphone",
    },
    {
      title: "Diabetes",
      dataIndex: "diabetes",
      key: "diabetes",
    },
    {
      title: "Hipertensão",
      dataIndex: "hypertension",
      key: "hypertension",
    },
    {
      title: "Ficha Paciente",
      dataIndex: "attendance",
      key: "attendance",
    },
    {
      title: "Selecionar",
      dataIndex: "select",
      key: "select",
    },
  ];

  const selectTutorColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Celular",
      dataIndex: "cellphone",
      key: "cellphone",
    },
    {
      title: "Pets",
      dataIndex: "dependents",
      key: "dependents",
    },
    {
      title: "Selecionar",
      dataIndex: "selectTutor",
      key: "selectTutor",
    },
  ];

  const setActiveTutor = (tutorId) => {
    petsService
      .setMainTutor(patient?.id, tutorId)
      .then((_res) =>
        notification.success({ message: "Tutor ativo com sucesso!" })
      )
      .finally(() => {
        setPatientReload((prv) => !prv);
      });
  };

  const assignPetToTutor = (tutorId, petId) => {
    petsService
      .assignPatientToTutor({
        holder: tutorId,
        patient: petId,
      })
      .then((_res) => {
        vincPetVisible ? setVincPetVisible(false) : router.back();
        setSelectedPetToVinc({});
        setTutor({});
        setPetToVinc(false);
        return notification.success({
          message: "Paciente vinculado com sucesso!",
        });
      });
  };

  const handleCreateTable = () => {
    sortItems(tutorsList, "name");
    if (tutorsList?.length > 0) {
      setData(
        tutorsList.map((tutor, i) => {
          const photoSrc = process.env.NEXT_PUBLIC_API + tutor.photo;
          return {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/*
                    <div
                      className="uk-margin-right"
                      style={{
                        borderRadius: "50%",
                        background: "#ccc",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                      }}
                    >
                      <img
                        className="uk-border-circle uk-margin-right"
                        id={`img-elem-${i}`}
                        width="50px"
                        height="50px"
                        src={photoSrc}
                        onError={() => {
                          const element = document.querySelector(`#img-elem-${i}`);
                          element.src =
                            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
                        }}
                      />
                    </div>
                    */}
                <span
                  className="uk-link"
                  onClick={() => {
                    setSelectedId(tutor?.id);
                    setDetailsVisible(true);
                  }}
                >
                  {tutor.name}
                </span>
              </div>
            ),
            email: tutor?.tutor?.email
              ? tutor?.tutor?.email
              : tutor?.email
              ? tutor?.email
              : "-",
            tag: tutor?.tag ?? "-",
            cellphone: tutor?.tutor?.cellphone
              ? Masks.phone(tutor?.tutor?.cellphone)
              : tutor?.cellphone
              ? Masks.phone(tutor?.cellphone)
              : "-",
            dependents: (
              <>
                {tutor?.dependents?.map((item) => `${item.name} | `)}
                {tutor?.dependents?.length === 0 && "Nenhum pet vinculado | "}
                {canCreatePet && (
                  <Dropdown
                    overlay={
                      <Menu
                        trigger="click"
                        items={[
                          {
                            key: "1",
                            label: "Vincular pet",
                            onClick: () => {
                              setVincPetVisible(true);
                              setSelectedTutor(tutor);
                            },
                          },
                          {
                            key: "2",
                            label: "Novo pet",
                            onClick: () => {
                              setSelectedTutor(tutor);
                              setCreatePetVisible(true);
                            },
                          },
                        ]}
                      />
                    }
                  >
                    <svg
                      viewBox="0 0 16 16"
                      height="20"
                      width="20"
                      focusable="false"
                      role="img"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="add-icon"
                    >
                      <title>PlusSquare icon</title>
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                    </svg>
                  </Dropdown>
                )}
              </>
            ),
            attendance: (
              <Link href={`/dashboard/paciente/${tutor?.id}`}>
                <Tag color="gray" style={{ cursor: "pointer" }}>
                  Ficha paciente
                </Tag>
              </Link>
            ),
            select: (
              <Button
                text="Criar oportunidade"
                onClick={() => {
                  setPayload((prv) => ({
                    ...prv,
                    contact: { cellphone: tutor?.cellphone },
                    contactId: tutor?.id,
                    tutorName: tutor?.name,
                    originId: tutor?.clientOrigin?.id,
                    originDescription: tutor?.clientOrigin?.description,
                  }));
                  setVisible(false);
                }}
              />
            ),
            hypertension: tutor?.hypertension ? "Sim" : "Não",
            diabetes: tutor?.diabetes ? "Sim" : "Não",
            actions: (
              <div className="uk-flex uk-flex-around">
                <FormCreateTutor
                  tutorId={tutor.id}
                  isModal
                  trigger={<Icon name="IconEdit" fill="#000" />}
                />

                {canDeleteTutor && (
                  <Delete id={tutor.id} reload={reload} setReload={setReload} />
                )}
              </div>
            ),
            selectTutor: (
              <Button
                onClick={() => assignPetToTutor(tutor.id, petToVinc)}
                text="Selecionar"
              />
            ),
          };
        })
      );
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    handleCreateTable();
  }, [reload, filters, tutorsList, canEditTutor, canDeleteTutor]);

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters((prv) => {
          return { ...prv, noSearch: false };
        });
        setReload ? setReload((prv) => !prv) : setLocalReload((prv) => !prv);
      }
    });
  }, []);

  return (
    <Container>
      <Table
        columns={
          process.env.client === "liftone"
            ? origin === "opportunities"
              ? crmLiftoneColumns
              : liftColumns
            : petToVinc
            ? selectTutorColumns
            : columns
        }
        dataSource={data}
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
      <InfinityForgeModal
        open={createPetVisible}
        onClose={() => setCreatePetVisible(false)}
        styles={{
          maxWidth: "1400px",
        }}
      >
        <FormCreatePatient
          onSuccess={() => setCreatePetVisible(false)}
          initialDataForm={
            selectedTutor && {
              holders: [{ id: selectedTutor?.id, main: true }],
            }
          }
          isModal={false}
          origin="aa"
        />
      </InfinityForgeModal>

      {detailsVisible && (
        <Modal
          visible={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          width={1200}
          footer={null}
        >
          <Single
            selectedId={selectedId}
            setVisible={setDetailsVisible}
            setEditVisible={setEditVisible}
            setCreatePetVisible={setCreatePetVisible}
            setVincPetVisible={setVincPetVisible}
          />
        </Modal>
      )}
      {editVisible && (
        <Modal
          width={1200}
          visible={editVisible}
          onCancel={() => setEditVisible(false)}
          footer={null}
        >
          <Edit tutorId={selectedId} setVisible={setEditVisible} />
        </Modal>
      )}

      {vincPetVisible && (
        <Modal
          visible={vincPetVisible}
          title={`Vincular pet - Tutor: ${selectedTutor?.name}`}
          onCancel={() => setVincPetVisible(false)}
          footer={null}
        >
          <label>Selecionar pet</label>
          <AutoComplete
            className="uk-width-1-1"
            options={patients?.map((patient) => ({
              ...patient,
              key: patient?.id,
              value: patient?.name,
            }))}
            value={selectedPetToVinc?.name}
            onChange={(val) => setSelectedPetToVinc({ name: val })}
            onSelect={(_, opt) => setSelectedPetToVinc(opt)}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
          <hr />
          <footer className="uk-flex uk-flex-right">
            <Button
              onClick={() =>
                assignPetToTutor(selectedTutor?.id, selectedPetToVinc?.id)
              }
              text="Vincular"
            />
          </footer>
        </Modal>
      )}
    </Container>
  );
}
