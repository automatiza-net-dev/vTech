// @ts-nocheck
import React, { memo, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Modal, useToast } from "infinity-forge";
import { Table } from "antd";

import { useAuth } from "@/OLD/hooks/useAuth";
import { petsService } from "@/OLD/services/patient.service";

import { Unlink } from "../unlink";
import { AddPatient } from "./AddPatient";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import {
  FormCreateTutor,
  ImageUploadS3,
  useConfigurationsSystem,
  useVerifyPermissions,
} from "@/presentation";
import PatientDetails from "@/presentation/pages/dashboard/paciente/patient-info/patient-info";

import { convertDate } from "@/OLD/utils/convertDate";

export function Single({
  selectedId,
  setVisible,
  setEditVisible,
  setCreatePetVisible,
  setVincPetVisible,
}) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState();
  const [photoSrc, setPhotoSrc] = useState(false);
  const [reload, setReload] = useState(false);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(false);

  const router = useRouter();
  const hasPermission = useVerifyPermissions("PET04");

  const { createToast } = useToast();

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gênero",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Data de nascimento",
      dataIndex: "birthDate",
      key: "birthDate",
    },
    {
      title: "Ficha paciente",
      dataIndex: "patientRec",
      key: "patientRec",
    },
    hasPermission && {
      title: "Desvincular Tutor/Pet",
      dataIndex: "unlinkTutorPet",
      key: "unlinkTutorPet",
    },
  ].filter(Boolean);

  const handleCreateTable = useCallback(
    (data) => {
      setPatients(
        data.map((patient) => {
          return {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
                  {patient.photo && (
                    <ImageUploadS3
                      className="uk-border-circle uk-margin-right"
                      width="50px"
                      height="50px"
                      src={patient.photo}
                    />
                  )}
                </div>
                <a
                  onClick={() => {
                    setSelectedPatientId(patient?.id);
                    setPatientDetailsOpen(true);
                  }}
                >
                  {patient?.name}
                </a>
              </div>
            ),
            gender: patient?.gender,
            birthDate: patient?.birth_date
              ? convertDate(patient?.birth_date)
              : "--------",
            patientRec: (
              <Button
                onClick={() =>
                  router.push(`/dashboard/paciente/${patient?.id}`)
                }
                text="Ficha paciente"
              />
            ),
            unlinkTutorPet: (
              <Unlink
                tutorId={selectedId}
                patientId={patient?.id}
                customSubmit={() => setReload((prev) => !prev)}
              />
            ),
          };
        })
      );
    },
    [router]
  );

  const handleGetSingleTutor = (id) => {
    petsService
      .getSingleTutor(id)
      .then((res) => {
        setTutor(res.data);
        handleCreateTable(res?.data?.dependents);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        createToast({ status: "error", message: "Erro ao buscar tutor" });
      });
  };

  React.useEffect(() => {
    setLoading(true);
    handleGetSingleTutor(selectedId);
  }, [reload, selectedId]);

  const { type } = useConfigurationsSystem();

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <div>
      <h2>{type !== "Vet" ? "Cliente" : "Responsável"}</h2>
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
              <ImageUploadS3 src={tutor?.photo} />
            </div>
            <div
              style={{
                position: "absolute",
                right: 40,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {type !== "Vet" && (
                <Link href={`/dashboard/paciente/${tutor?.id}`}>
                  <Button
                    type="secondary"
                    classCallback="uk-margin-right"
                    text="Ficha paciente"
                  />
                </Link>
              )}
              <Button
                type="secondary"
                classCallback="uk-margin-right"
                onClick={() => setVisible(false)}
                text="Voltar"
              />

              <FormCreateTutor
                isModal
                tutorId={tutor?.id}
                trigger={<Button text="Editar" />}
              />
            </div>
          </div>
          {type !== "Vet" && (
            <div>
              <div>
                <label>Diabetes: {tutor?.diabetes ? "Sim" : "Não"}</label>
              </div>
              <div>
                <label>
                  Hipertensão: {tutor?.hypertension ? "Sim" : "Não"}
                </label>
              </div>
            </div>
          )}

          <div className="uk-flex uk-flex-between">
            <div className="uk-flex uk-flex-column uk-width-1-4 uk-margin-top">
              <h5 className="uk-heading-line">
                <span>Contato</span>
              </h5>

              <span>
                Telefone:{" "}
                {tutor?.tutor?.cellphone === ""
                  ? "Nenhum telefone cadastrado"
                  : tutor?.tutor?.cellphone}
              </span>
              <span>
                Email:{" "}
                {tutor?.tutor?.email === ""
                  ? "Nenhum email cadastrado"
                  : tutor?.tutor?.email}
              </span>
            </div>
            <div className="uk-flex uk-flex-column uk-width-1-4">
              <h5 className="uk-heading-line">
                <span>Documentos</span>
              </h5>
              <span>
                Nome:{" "}
                {tutor?.name === "" ? "Nenhum nome cadastrado" : tutor?.name}
              </span>
              <span>
                Data de nascimento:{" "}
                {tutor?.birth_date === ""
                  ? "Nenhuma razão social cadastrada"
                  : convertDate(tutor?.birth_date)}
              </span>
              <span>
                CPF/CNPJ:{" "}
                {tutor?.tutor?.document === ""
                  ? "Nenhum documento cadastrado"
                  : tutor?.tutor?.document}
              </span>
              <span>
                RG:{" "}
                {tutor?.tutor?.inscription === null
                  ? "Nenhum documento cadastrado"
                  : tutor?.tutor?.inscription}
              </span>

              {tutor?.gender && <span>Gênero: {tutor?.gender}</span>}

              <span>
                Profissão:{" "}
                {tutor?.tutor?.profession &&
                  tutor?.tutor?.profession?.description}
              </span>
              <span>
                Estado Civil:{" "}
                {tutor?.tutor?.civil_status && tutor?.tutor?.civil_status}
              </span>
              <span>
                Nacionalidade:{" "}
                {tutor?.tutor?.nationality && tutor?.tutor?.nationality}
              </span>
            </div>

            <div className="uk-flex uk-flex-column uk-width-1-4">
              <h5 className="uk-heading-line">
                <span>Endereço</span>
              </h5>
              <span>
                CEP:{" "}
                {tutor?.tutor?.postal_code === ""
                  ? "Nenhum cep cadastrado"
                  : tutor?.tutor?.postal_code}
              </span>
              <span>
                Rua:{" "}
                {tutor?.tutor?.street === ""
                  ? "Nenhuma rua cadastrada"
                  : tutor?.tutor?.street}
              </span>
              <span>
                Bairro:{" "}
                {tutor?.tutor?.district === ""
                  ? "Nenhum bairro cadastrado"
                  : tutor?.tutor?.district}
              </span>
              <span>
                Complemento:{" "}
                {tutor?.tutor?.complement === ""
                  ? ""
                  : tutor?.tutor?.complement}
              </span>
              <span>
                Número:{" "}
                {tutor?.tutor?.number === ""
                  ? "Nenhum número cadastrado"
                  : tutor?.tutor?.number}
              </span>
              <span>
                Cidade:{" "}
                {tutor?.tutor?.city === ""
                  ? "Nenhuma cidade cadastrada"
                  : tutor?.tutor?.city}
              </span>
              <span>
                Estado:{" "}
                {tutor?.tutor?.state === ""
                  ? "Nenhum estado cadastrado"
                  : tutor?.tutor?.state}
              </span>
            </div>
          </div>
        </>
      </div>

      {type === "Vet" && (
        <>
          <div className="uk-flex uk-flex-between uk-margin-bottom">
            <h3 className="uk-margin-remove">Pacientes</h3>
            <AddPatient
              tutorId={tutor?.id}
              setReload={setReload}
              setCreatePetVisible={setCreatePetVisible}
              setVincPetVisible={setVincPetVisible}
            />
          </div>
          <Table columns={columns} dataSource={patients} />
        </>
      )}
      <Modal
        open={patientDetailsOpen}
        onClose={() => setPatientDetailsOpen(false)}
        styles={{ width: "1100px" }}
        children={
          <PatientDetails
            selectedId={selectedPatientId}
            setVisible={setPatientDetailsOpen}
          />
        }
      />
    </div>
  );
}
