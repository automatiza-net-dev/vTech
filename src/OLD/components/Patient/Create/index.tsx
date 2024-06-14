// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Form, notification } from "antd";
import { Button, LoadingSpin } from "@/OLD/components/mini-components";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { petsService } from "@/OLD/services/patient.service";
import { useTutor } from "@/OLD/hooks/useTutor";
import { FormChild } from "../Edit/FormChild";
import { Container } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";

import moment from "moment";

export function CreatePatient({
  setVisible,
  onSuccess,
  tutorToVinc = false,
  isSchedule = false,
}) {
  const [data, setData] = useState();
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [reload, setReload] = useState(false);

  const { tutors: allTutors } = useTutor(false, reload);

  const createPatientPermission = useUserHasPermission("PET01");

  const handleSubmit = React.useCallback(() => {
    const newObj = { ...data };
    delete newObj?.holder;
    setLoading(true);

    if (!newObj?.name) {
      setLoading(false);
      return notification.error({
        message: "Preencha o campo de nome",
      });
    }

    if (!newObj?.raceId) {
      setLoading(false);
      return notification.error({
        message: "Preencha o campo de Espécie > Raça do paciente",
      });
    }

    if (!newObj?.gender) {
      setLoading(false);
      return notification.error({
        message: "Preencha o campo de Gênero",
      });
    }

    if (!newObj?.birthDate) {
      setLoading(false);
      return notification.error({
        message: "Preencha o campo de data de nascimento",
      });
    }

    if (!tutors[0]?.id) {
      setLoading(false);
      if (!tutorToVinc) {
        return notification.error({
          message: "Selecione um tutor para este paciente",
        });
      }
    }

    if (!isSchedule) {
      if (!newObj?.vaccineOrigin) {
        setLoading(false);
        return notification.error({
          message: "Preencha o campo de 'O paciente é vacinado?'",
        });
      }

      if (!newObj?.castrated) {
        setLoading(false);
        return notification.error({
          message: "Preencha o campo de 'O paciente é castrado'",
        });
      }

      if (!newObj?.hairId) {
        setLoading(false);
        return notification.error({
          message: "Preencha o campo de 'Tipo de pelagem do paciente'",
        });
      }
    }

    petsService
      .createPatient({
        ...newObj,
        photo: photo,
        birthDate: moment(newObj?.birthDate).format("YYYY-MM-DD"),
        holderId: selectedTutors[0]?.id ? selectedTutors[0]?.id : tutorToVinc,
        castrated: data?.castrated === "true" ? true : false,
      })
      .then((res) => {
        setLoading(false);
        selectedTutors?.forEach((tutor, i) => {
          i !== 0 &&
            petsService.assignPatientToTutor({
              holder: tutor?.id,
              patient: res?.data?.id,
            });

          i === 0 && petsService.setMainTutor(res?.data?.id, tutor?.id);
        });

        tutors?.length === 1 &&
          petsService.setMainTutor(res.data.id, tutors[0].id);

        setVisible(false);
        notification.success({
          message: "Sucesso",
          description: "Paciente cadastrado!",
        });

        onSuccess && onSuccess(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.errors?.length > 0) {
          if (err?.response?.data?.errors[0]?.field === "holderId") {
            return notification.warning({
              message: "Cadastre ou vincule um tutor para o pet",
            });
          }
        }
        setLoading(false);
        notification.error({
          message: "Erro",
          description: "Erro ao criar paciente",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, loading, tutors, selectedTutors, tutorToVinc, isSchedule]);

  useEffect(() => {
    allTutors?.length > 0 && setTutors(allTutors);
  }, [allTutors]);

  return !createPatientPermission || createPatientPermission === "loading" ? (
    <AccessDenied loading={createPatientPermission} />
  ) : (
    <Container>
      <h2>Cadastrar novo paciente</h2>

      <Form
        layout="vertical"
        onSubmitCapture={(e) => {
          if (
            e.target.id !== "form-create-tutor" &&
            e.target.id !== "form-especie-create" &&
            e.target.id !== "form-create-race"
          )
            handleSubmit();
        }}
        id="form-patients"
      >
        <FormChild
          data={data}
          setData={setData}
          setPhoto={setPhoto}
          tutors={tutors}
          setTutors={setTutors}
          selectedTutors={selectedTutors}
          setSelectedTutors={setSelectedTutors}
          setRefreshTutors={setReload}
          tutorToVinc={tutorToVinc}
        />
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button
            type="button"
            onClick={() => setVisible(false)}
            classCallback="uk-margin-right"
          >
            {" "}
            Voltar{" "}
          </Button>
          <Button type="submit" htmlFor="form-patients">
            {loading ? <LoadingSpin /> : "Cadastrar"}
          </Button>
        </footer>
      </Form>
    </Container>
  );
};
