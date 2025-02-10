// @ts-nocheck
import React, { useEffect, useState } from "react";

import moment from "moment";
import { useRouter } from "next/router";
import { Button, PageWrapper, Accordion, useToast } from "infinity-forge";
import { Table, Modal, Tag } from "antd";

import { petsService } from "@/OLD/services/patient.service";

import { VaccinesPanel } from "./components";
import { Unlink } from "@/OLD/components/Tutor/unlink";
import TutorVincForm from "./components/tutor-vinc-form";
import { DateToDDMMYYYY, useLoadPatient } from "@/presentation";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import { FormCreatePatient, useVerifyPermissions } from "@/presentation";

import { convertDate } from "@/OLD/utils/convertDate";

import { GiConfirmed } from "react-icons/gi";

function Single({ selectedId, setVisible }) {
  const patientData = useLoadPatient(selectedId);
  const [patient, setPatient] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [newTutorOpen, setNewTutorOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const router = useRouter();

  const {createToast} = useToast()

  const setActiveTutor = (tutorId) => {
    petsService
      .setMainTutor(selectedId, tutorId)
      .then((_res) =>   createToast({ status: "success", message: "Tutor ativo com sucesso!" })

      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  };

  const handleGetSinglePatient = () => {
    setPatient({
      ...patientData?.data,
      tutors:
        patientData?.data?.holders &&
        patientData?.data?.holders.map((tutor) => {
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
                <GiConfirmed
                  onClick={() => setActiveTutor(tutor?.id)}
                  style={{ cursor: "pointer" }}
                />
            ) : (
              <Tag color={"blue"}>Ativo</Tag>
            ),
          };
        }),
    });
  };

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
    handleGetSinglePatient();
  }, [reload, patientData?.data]);

  const patientPhoto =
    patient?.photo || "/images/logo/sancla-default-profile.png";

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <PageWrapper title="Detalhes do paciente">
      <div
        style={{
          gap: "10px",
          display: "flex",
          padding: '10px',
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={() => router.push(`/dashboard/paciente/${patient?.id}`)}
          text="Ficha paciente"
        />

        <Button onClick={() => setVisible(false)} text="Voltar" />

        <FormCreatePatient
          isModal
          patientId={patient?.id}
          trigger={<Button text="Editar" />}
        />
      </div>
      <div>
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            marginTop: "50px",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                borderRadius: "50%",
                background: "#ccc",
                width: "115px",
                height: "115px",
                border: "solid 3px var(--darkBlue)",
                overflow: "hidden",
              }}
            >
              <img
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={patientPhoto}
              />
            </div>
            <br />
            <section style={{ width: "90%" }}>
              <h5 className="uk-heading-line">
                <span>Dados do paciente</span>
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <span>
                    Nome:
                    {` ${patient?.name}`}
                  </span>
                  <h4>RG: {patient?.tag}</h4>
                  <span>
                    Gênero:
                    {` ${patient?.gender}`}
                  </span>
                  <p>Microchip: {patient?.microchip}</p>
                  <p>
                    Castrado:{" "}
                    {patient?.patientAnimal?.castrated ? "Sim" : "Não"}
                  </p>
                  <span>
                    Tags:
                    {` ${patient?.tags}`}
                  </span>
                </div>
                <div>
                  <p>
                    Criado em: {moment(patient?.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    Data de nascimento:
                    {` ${convertDate(patient?.birth_date)}`}
                  </p>
                  <p>
                    Espécie {">"} Raça: {patient?.race} {">"} {patient?.specie}
                  </p>
                  <p>
                    Peso:{" "}
                    {patient?.weight && patient?.weightDate
                      ? `${patient?.weight + " kg"} em ${DateToDDMMYYYY(
                          patient?.weightDate
                        )}`
                      : "-"}
                  </p>
                  <p>Óbito: {patient?.death ? "Sim" : "Não"}</p>

                  <p>
                    Ativo:
                    {patient?.active ? " Ativo" : " Inativo"}
                  </p>
                </div>
                <div>
                  <p>Comunidade sancla: {patient?.community ? "Sim" : "Não"}</p>
                  <p>Idade: {patient?.age}</p>
                  <p>Pelagem: {patient?.hair}</p>
                  {patient?.death && (
                    <p>
                      Data do óbito:{" "}
                      {moment(patient?.death_date).format("DD/MM/YYYY")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="uk-margin-small-top">
          <Accordion
            closeIcon={"IconTopNavigation"}
            openIcon={"IconArrowRight"}
            title="Tutores"
            key="tutors"
            children={
              <>
                <hr />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => setNewTutorOpen(true)}
                    text="Vincular tutor"
                  />
                </div>

                <Table
                  dataSource={patient?.tutors}
                  columns={Columns}
                  className="uk-margin-small-top"
                />
              </>
            }
          />
        </section>
        {patient?.id && (
          <Accordion
            closeIcon={"IconTopNavigation"}
            openIcon={"IconArrowRight"}
            title="Vacinas"
            key="vaccines"
            children={<VaccinesPanel patientId={patient?.id} />}
          />
        )}
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
    </PageWrapper>
  );
}

export default Single;
