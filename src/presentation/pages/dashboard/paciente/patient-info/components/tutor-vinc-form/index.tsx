// @ts-nocheck

// Core
import React, { memo, useState, useEffect, useCallback } from "react";

// Services
import { petsService } from "@/OLD/services/patient.service";

// Hooks
import { useTutor } from "@/OLD/hooks/useTutor";

// Components
import { AutoComplete, Button, notification } from "antd";

function TutorVincForm({ patient, setVisible, setReload, reload }: any) {
  const [tutor, setTutor] = useState({});
  const [loading, setLoading] = useState(false);
  const [formatedTutors, setFormatedTutors] = useState([]);
  const { tutors } = useTutor();

  const formatTutors = () => {
    setFormatedTutors(
      tutors.map((tutor) => {
        return {
          ...tutor,
          value: tutor?.name,
        };
      })
    );
  };

  useEffect(() => {
    tutors?.length > 0 && formatTutors();
  }, [tutors]);

  const submitVinc = useCallback(() => {
    setLoading(true);
    petsService
      .assignPatientToTutor({
        holder: tutor?.tutorId,
        patient: patient?.id,
      })
      .then((res) =>
        notification.success({
          message: "Tutor vinculado com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao vincular o tutor...",
        });
      })
      .finally(() => {
        setTutor({});
        setReload(!reload);
        setVisible(false);
      });
  }, [tutor]);

  return (
    <div>
      <label>Selecione o tutor a ser vinculado</label>
      <AutoComplete
        className="uk-width-1-1"
        required
        options={formatedTutors}
        value={tutor?.userName}
        onChange={(e) => setTutor({ ...tutor, tutorName: e })}
        onSelect={(inputValue, option) =>
          setTutor({
            ...tutor,
            userName: inputValue,
            tutorId: option?.id,
          })
        }
        filterOption={(inputValue, option) => {
          if (option?.name?.includes(inputValue)) {
            return option;
          }
        }}
      />
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button
          type="primary"
          className="uk-margin-right"
          onClick={() => submitVinc()}
        >
          Vincular
        </Button>
        <Button onClick={() => setVisible(false)}> Cancelar </Button>
      </footer>
    </div>
  );
}

export default TutorVincForm;
