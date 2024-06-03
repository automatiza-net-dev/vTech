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
import { PlusSquare } from "@styled-icons/bootstrap/PlusSquare";
import { GiConfirmed } from "react-icons/gi";
// import { UsersIcon } from "@/OLD/common/icons";

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
  Button,
} from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Single } from "../Single";
import { Edit } from "../Edit";
import { CreatePatient } from "@/OLD/components/Patient/Create";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import Masks from "@/OLD/utils/masks";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { normalizeStr } from "@/OLD/utils/normalizeString";

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
                    <PlusSquare className="add-icon" size={20} />
                  </Dropdown>
                )}
              </>
            ),
            attendance: (
              <Link href={`/dashboard/atendimento/${tutor?.id}`}>
                <Tag color="gray" style={{ cursor: "pointer" }}>
                  Ficha paciente
                </Tag>
              </Link>
            ),
            select: (
              <CustomButton
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
              >
                criar oportunidade
              </CustomButton>
            ),
            hypertension: tutor?.hypertension ? "Sim" : "Não",
            diabetes: tutor?.diabetes ? "Sim" : "Não",
            actions: (
              <div className="uk-flex uk-flex-around">
                {process.env.client === "sancla" && <div>
                  {!router.query.page?.includes("tutor") &&
                    (tutors && tutor?.is_main ? (
                      <Tag color="blue">Tutor Ativo</Tag>
                    ) : (
                      <Tooltip title="Definir tutor ativo">
                        <GiConfirmed
                          onClick={() => setActiveTutor(tutor?.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    ))}
                </div>}

                {canEditTutor && (
                  <EditTwoTone
                    className="uk-margin-small-top"
                    onClick={() => {
                      setSelectedId(tutor?.id);
                      setEditVisible(true);
                    }}
                  />
                )}
                {canDeleteTutor && (
                  <Delete id={tutor.id} reload={reload} setReload={setReload} />
                )}
              </div>
            ),
            selectTutor: (
              <CustomButton
                onClick={() => assignPetToTutor(tutor.id, petToVinc)}
              >
                Selecionar
              </CustomButton>
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
      {createPetVisible && (
        <Modal
          visible={createPetVisible}
          onCancel={() => setCreatePetVisible(false)}
          width={1200}
          footer={null}
        >
          <CreatePatient
            setVisible={setCreatePetVisible}
            tutorToVinc={selectedTutor?.id}
          />
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
              type="primary"
              onClick={() =>
                assignPetToTutor(selectedTutor?.id, selectedPetToVinc?.id)
              }
            >
              Vincular
            </Button>
          </footer>
        </Modal>
      )}
    </Container>
  );
}
