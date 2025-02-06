import React, { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/router";

import { notification } from "antd";

import TimeLine from "./Timeline";
import { petsService } from "@/OLD/services/patient.service";

import { Container } from "./styles";
import { useToast } from "infinity-forge";

export default function Attendance() {
  const [patient, setPatient] = useState({});
  const [tutorData, setTutorData] = useState({});
  const [reload, setReload] = useState(false);
  const [reloadExtern, setReloadExtern] = useState(false);

  const router = useRouter();
  const patientId = router?.query?.subpage;

  const { createToast } = useToast()

  const getTutorData = (Id?: any, id?: any): any => {
    petsService
      .getTutors({ patientId: Id })
      .then((res) => {
        setTutorData(res.data?.find((tutor) => tutor?.id === id));
      })
      .catch((_err) => {

        createToast({ status: "error", message: "Houve um erro ao buscar as informações do tutor..." })
      });
  };

  const getPet = useCallback(() => {
    petsService
      .getSinglePatient(patientId)
      .then((res) => {
        setPatient(res.data);
        getTutorData(
          res.data.id,
          res.data?.tutors.find((tutor) => tutor?.is_main)?.id
        );
      })
      .catch(() => {
        createToast({ status: "error", message: "Não foi possível recuperar as informações do paciente..." })
      });
  }, [patientId]);

  const getPatientHuman = useCallback(() => {
    petsService
      .getSingleTutor(patientId)
      .then((res) => {
        setPatient(res.data);
        getTutorData(res.data.id);
      })
      .catch(() => {
        createToast({ status: "error", message: "Não foi possível recuperar as informações do paciente..." })
      });
  }, [patientId]);

  useEffect(() => {
    process.env.client !== "liftone" ? getPet() : getPatientHuman();
  }, [getPet]);

  return (
    <Container className="uk-padding uk-padding-remove-top">
      <section>
        <TimeLine
          patient={
            (process.env.client !== "liftone"
              ? { ...patient, tutorData }
              : patient) as any
          }
          reload={reload}
          setReload={setReload}
          reloadExtern={reloadExtern}
        />
      </section>
    </Container>
  );
}
