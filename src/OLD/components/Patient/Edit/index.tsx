// @ts-nocheck
import React, { memo, useCallback, useEffect, useState } from "react";

import { Form } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";
import { petsService } from "@/OLD/services/patient.service";
import { FormChild } from "./FormChild";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Container } from "./styles";
import moment from "moment";

import { Select, FormHandler, useToast } from "infinity-forge";
import { useToast } from "infinity-forge";

export function Edit({ id, setVisible }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [activeTutor, setActiveTutor] = useState(false);

  const { originConfig, setOriginConfig } = useAuth();
  const { createToast } = useToast();

  const editPatientPermission = useUserHasPermission("PET02");
  const handleSubmit = useCallback(() => {
    setLoading(true);

    if (originConfig === "Crm") {
      if (!data?.name) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de nome",
          status: "error",
        });
      }
    }

    if (originConfig === "") {
      if (!data?.name) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de nome",
          status: "error",
        });
      }

      if (!data?.raceId?.id) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo da raça do paciente",
          status: "error",
        });
      }

      if (!data?.gender) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de Gênero",
          status: "error",
        });
      }

      if (!data?.birthDate) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de data de nascimento",
          status: "error",
        });
      }

      if (!data?.vaccineOrigin) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de 'O paciente é vacinado?'",
          status: "error",
        });
      }

      if (!data?.castrated) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de 'O paciente é castrado'",
          status: "error",
        });
      }

      if (!data?.hairId) {
        setLoading(false);
        return createToast({
          message: "Preencha o campo de 'Tipo de pelagem do paciente'",
          status: "error",
        });
      }
    }

    if (selectedTutors?.length > 0) {
      selectedTutors.forEach((tutor) =>
        petsService.assignPatientToTutor({
          holder: tutor?.id,
          patient: id,
        })
      );
    }

    petsService
      .editPatient(
        {
          ...data,
          photo: photo,
          birthDate: moment(data?.birthDate).format("YYYY-MM-DD"),
          raceId: data?.raceId
            ? data?.raceId.id
            : data?.patientAnimal?.race?.id,
          deathDate: moment(data?.deathDate).toISOString(),
        },
        id
      )
      .then((_res) => {
        setVisible(false);
        petsService.setMainTutor(id, activeTutor?.id);
        return createToast({
          message: "Paciente editado!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: "Erro ao editar paciente",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, photo, id, selectedTutors, activeTutor?.id]);

  useEffect(() => {
    petsService
      .getSinglePatient(id)
      .then((res) => {
        setData({
          ...res.data,
          raceId: { id: res?.data?.patientAnimal?.race?.id },
          vaccineOrigin: res?.data?.vaccine_origin,
          birthDate: res.data.birth_date
            ? moment(res.data.birth_date, "YYYY-MM-DD[T]HH:mm:ss")
            : null,
          microchip: res.data?.patientAnimal?.microchip,
          castrated: res.data?.patientAnimal?.castrated
            ? `${res.data?.patientAnimal?.castrated}`
            : "false",
          death: `${res.data?.patientAnimal?.death}`,
          deathDate: res.data?.patientAnimal?.death_date
            ? moment(res.data?.patientAnimal?.death_date)
            : null,
          hairId: res.data?.patientAnimal?.hair?.id,
        });
      })
      .catch((err) => {
        return createToast({
          message: "Erro ao buscar paciente",
          status: "error",
        });
      });
  }, [id]);

  return !editPatientPermission || editPatientPermission === "loading" ? (
    <AccessDenied loading={editPatientPermission} />
  ) : (
    <Container>
      <h3>Editar paciente</h3>

      <Form
        layout="vertical"
        onSubmitCapture={(e) => {
          if (
            e.target.id !== "form-especie-create" &&
            e.target.id !== "form-create-race" &&
            e.target.id !== "form-create-tutor"
          )
            handleSubmit();
        }}
      >
        <FormChild
          data={data}
          setData={setData}
          setPhoto={setPhoto}
          selectedTutors={selectedTutors}
          setSelectedTutors={setSelectedTutors}
          setActiveTutor={setActiveTutor}
        />
        <hr />
        <div className="uk-flex uk-flex-between uk-width-1-5">
          <Button
            type="button"
            onClick={() => setVisible(false)}
            text="Voltar"
          />

          <Button type="submit" text={loading ? "Carregando..." : "Salvar"} />
        </div>
      </Form>
    </Container>
  );
}
