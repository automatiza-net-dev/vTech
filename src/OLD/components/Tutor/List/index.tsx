import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import { petsService } from "@/OLD/services/patient.service";

import { useTutor } from "@/OLD/hooks/useTutor";
import { usePatients } from "@/OLD/hooks/usePatients";

import { FiEdit2 } from "react-icons/fi";

import { Delete } from "../Delete";
import { Container } from "./styles";
import { Tag, Table, Dropdown, Menu, AutoComplete } from "antd";
import { Single } from "../Single";
import { Edit } from "../Edit";

import { sortItems } from "@/OLD/utils/sortItems";
import Masks from "@/OLD/utils/masks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import {
  FormCreatePatient,
  FormCreateTutor,
  useConfigurationsSystem,
} from "@/presentation";
import { Icon, Modal, Button, useAuthAdmin, useToast } from "infinity-forge";

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

  const [data, setData] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [vincPetVisible, setVincPetVisible] = useState(false);
  const [createPetVisible, setCreatePetVisible] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedPetToVinc, setSelectedPetToVinc] = useState<any>(null);

  const { tutors: tutorsList } = useTutor(filters, reload);
  const { patients } = usePatients(false, false, {} as any, vincPetVisible);
  const { type } = useConfigurationsSystem();

  const router = useRouter();

  const { createToast } = useToast();

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
        createToast({ status: "success", message: "Tutor ativo com sucesso!" })
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

        setPetToVinc(false);
        return createToast({
          status: "success",
          message: "Paciente vinculado com sucesso!",
        });
      });
  };

  const handleCreateTable = () => {
    sortItems(tutorsList, "name");
    if (tutorsList?.length > 0) {
      setData(
        tutorsList.map((tutor: any, i) => {
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
                  isModal
                  origin="Cadastro"
                  tutorId={tutor?.id}
                  trigger={
                    <FiEdit2
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    />
                  }
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
          } as any;
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
        setReload && setReload((s) => !s);
      }
    });
  }, []);

  return (
    <Container>
      <Table
        columns={
          type === "Vet"
            ? petToVinc
              ? selectTutorColumns
              : columns
            : origin === "opportunities"
            ? crmLiftoneColumns
            : liftColumns
        }
        dataSource={data}
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
        open={createPetVisible}
        onClose={() => setCreatePetVisible(false)}
        styles={{
          width: "1200px",
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
        />
      </Modal>

      {detailsVisible && (
        <Modal
          open={detailsVisible}
          onClose={() => setDetailsVisible(false)}
          styles={{ width: "1200px" }}
          children={
            <Single
              selectedId={selectedId}
              setVisible={setDetailsVisible}
              setEditVisible={setEditVisible}
              setCreatePetVisible={setCreatePetVisible}
              setVincPetVisible={setVincPetVisible}
            />
          }
        />
      )}
      {editVisible && (
        <Modal
          styles={{ width: "1200px" }}
          open={editVisible}
          onClose={() => setEditVisible(false)}
          children={<Edit tutorId={selectedId as any} setVisible={setEditVisible} />}
        />
      )}

      {vincPetVisible && (
        <Modal
          open={vincPetVisible}
          onClose={() => setVincPetVisible(false)}
          children={
            <>
              <h2>Vincular pet - Tutor: ${selectedTutor?.name}</h2>

              <label>Selecionar pet</label>
              <AutoComplete
                className="uk-width-1-1"
                style={{height: '300px'}}
                options={patients?.map((patient: any) => ({
                  ...patient,
                  key: patient?.id,
                  value: `${patient?.name} - RG:${patient?.tag} - Raça:${patient?.race?.specie?.description} > ${patient?.race?.description}`,
                }))}
                value={selectedPetToVinc?.name}
                onChange={(val) => setSelectedPetToVinc({ name: val })}
                onSelect={(_, opt) => setSelectedPetToVinc(opt)}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
                getPopupContainer={(trigger) => trigger.parentNode}
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
            </>
          }
        />
      )}
    </Container>
  );
}
