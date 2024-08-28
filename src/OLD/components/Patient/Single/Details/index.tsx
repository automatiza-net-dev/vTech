// @ts-nocheck

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { petsService } from "@/OLD/services/patient.service";
import { notification, Table, Modal, Tooltip, Tag } from "antd";
import { Button, LoadingSkeleton } from "@/OLD/components/mini-components";
import Link from "next/link";
import { convertDate } from "@/OLD/utils/convertDate";
import TutorVincForm from "./TutorVincForm";

// Utils
import moment from "moment";

// Icons
import { BiPlusMedical } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
import { FormCreatePatient, useVerifyPermissions } from "@/presentation";
import { Unlink } from "@/OLD/components/Tutor/unlink";

const Details = React.memo(function Single({
  selectedId,
  setVisible,
  setEditVisible,
}) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoSrc, setPhotoSrc] = useState();
  const [newTutorOpen, setNewTutorOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const router = useRouter();

  const setActiveTutor = (tutorId) => {
    petsService
      .setMainTutor(id, tutorId)
      .then((_res) =>
        notification.success({ message: "Tutor ativo com sucesso!" })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  };

  const handleGetSinglePatient = useCallback(
    (id) => {
      setLoading(true);
      petsService
        .getSinglePatient(id)
        .then((res) => {
          setPatient({
            ...res.data,
            tutors: res?.data?.tutors?.map((tutor) => {
              return {
                ...tutor,
                unlinkTutorPet: (
                  <Unlink
                    patientId={selectedId}
                    tutorId={tutor?.id}
                    customSubmit={() => setReload((prev) => !prev)}
                  />
                ),
                activeTutor: !tutor?.is_main ? (
                  <Tooltip title="Definir tutor ativo">
                    <GiConfirmed
                      onClick={() => setActiveTutor(tutor?.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                ) : (
                  <Tag color={"blue"}>Ativo</Tag>
                ),
              };
            }),
          });
        })
        .catch((err) => {
          notification.error({
            message: "Erro",
            description: "Erro ao buscar paciente",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [selectedId]
  );

  const hasPermission = useVerifyPermissions("PET04");
  const Columns = [
    {
      title: "Tutor",
      key: "name",
      dataIndex: "name",
      render: (_, data) =>
        data?.is_main ? `${data?.name} - Ativo` : data?.name,
    },
    {
      title: "Telefone",
      key: "cellphone",
      dataIndex: "cellphone",
      render: (_, data) => data?.tutor?.cellphone,
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      render: (_, data) => data?.tutor?.email,
    },
    {
      title: "Tutor ativo",
      key: "activeTutor",
      dataIndex: "activeTutor",
    },
    hasPermission && {
      title: "Desvincular Tutor/Pet",
      dataIndex: "unlinkTutorPet",
      key: "unlinkTutorPet",
    },
  ].filter(Boolean);

  useEffect(() => {
    handleGetSinglePatient(selectedId);
  }, [selectedId, reload]);

  useEffect(() => {
    setPhotoSrc(process.env.NEXT_PUBLIC_API + patient?.photo);
  }, [patient]);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <div>
      <h3>Paciente</h3>
      <div
        className="uk-card uk-card-body uk-margin-bottom"
        style={{ background: "#fff", borderRadius: "20px", marginTop: "50px" }}
      >
        <>
          <div className="uk-margin-large-bottom">
            <div
              style={{
                borderRadius: "50%",
                background: "#ccc",
                width: "115px",
                height: "115px",
                display: "flex",
                border: "solid 3px var(--darkBlue)",
                marginTop: "50px",
                position: "absolute",
                top: -80,
              }}
            >
              {patient?.photo && (
                <img
                  className="uk-border-circle"
                  width="115px"
                  height="115px"
                  src={photoSrc}
                />
              )}
            </div>
            <div
              style={{
                position: "absolute",
                right: 40,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() =>
                  router.push(`/dashboard/paciente/${patient?.id}`)
                }
                classCallback="uk-margin-small-right"
              >
                Ficha paciente
              </Button>
              <Button
                onClick={() => setVisible(false)}
                classCallback="uk-margin-small-right"
              >
                Voltar
              </Button>

              <FormCreatePatient
                isModal
                patientId={patient?.id}
                trigger={<Button>Editar</Button>}
              />
            </div>
          </div>
          <br />
          <h5 className="uk-heading-line">
            <span>Dados do paciente</span>
          </h5>
          <div className="uk-flex">
            <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
              <span>
                Nome:
                {` ${patient?.name}`}
              </span>
              <span>
                Data de nascimento:
                {` ${convertDate(patient?.birth_date)}`}
              </span>
              <span>
                Tags:
                {` ${patient?.tags}`}
              </span>
            </div>
            <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
              <span>
                Criado em:
                {` ${convertDate(patient?.created_at)}`}
              </span>
              <span>
                Gênero:
                {` ${patient?.gender}`}
              </span>
              <span>
                Ativo:
                {patient?.active ? " Ativo" : " Inativo"}
              </span>
            </div>
            <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
              <h4 className="uk-margin-remove">RG: {patient?.tag}</h4>
              <p className="uk-margin-remove">Peso: {patient?.weight}</p>
              <p className="uk-margin-remove">
                Data pesagem:{" "}
                {moment(patient?.weight_date).format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="uk-flex uk-flex-column uk-margin-xlarge-right">
              <p className="uk-margin-remove">
                Castrado: {patient?.patientAnimal?.castrated ? "Sim" : "Não"}
              </p>
              <p className="uk-margin-remove">
                Óbito: {patient?.patientAnimal?.death ? "Sim" : "Não"}
              </p>
              {patient?.patientAnimal?.death && (
                <p className="uk-margin-remove">
                  Data do óbito:{" "}
                  {moment(patient?.patientAnimal?.death_date).format(
                    "DD/MM/YYYY"
                  )}
                </p>
              )}
            </div>
            <div>
              <p className="uk-margin-remove">
                Microchip: {patient?.patientAnimal?.microchip}
              </p>
              <p className="uk-margin-remove">
                Pelagem: {patient?.patientAnimal?.hair?.description}
              </p>
            </div>
          </div>
        </>
      </div>
      <section className="uk-margin-small-top">
        <div className="uk-flex uk-flex-between">
          <h4>Tutores</h4>
          <div>
            <Button onClick={() => setNewTutorOpen(true)}>
              Vincular tutor
            </Button>
          </div>
        </div>
        <Table
          dataSource={patient?.tutors}
          columns={Columns}
          className="uk-margin-small-top"
        />
      </section>
      <Modal
        title="Vincular tutor"
        visible={newTutorOpen}
        footer={null}
        onCancel={() => setNewTutorOpen(false)}
      >
        <TutorVincForm
          reload={reload}
          setReload={setReload}
          patient={patient}
          setVisible={setNewTutorOpen}
        />
      </Modal>
    </div>
  );
});

export default Details;
