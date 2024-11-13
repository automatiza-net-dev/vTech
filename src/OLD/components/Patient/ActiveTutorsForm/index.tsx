// @ts-nocheck
// Core
import React, { memo, useState, useCallback } from "react";

import { petsService } from "@/OLD/services/patient.service";

// Components
import { Container } from "./styles";
import { Popconfirm, Button, notification } from "antd";

const ActiveTutorsForm = memo(function ({
  patient,
  setVisible,
  refreshList,
  setRefreshList,
}) {
  const [selectedTutor, setSelectedTutor] = useState({});
  const [loading, setLoading] = useState(false);

  const submitMainTutor = useCallback(() => {
    setLoading(true);
    petsService
      .setMainTutor(patient?.id, selectedTutor?.id)
      .then((_) =>
        notification.success({ message: "Tutor ativo definido com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao definir o tutor ativo...",
        });
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
        setLoading(false);
        setRefreshList(!refreshList);
      });
  }, [patient?.id, selectedTutor?.id]);

  return (
    <Container>
      <h2>Selecionar tutor ativo</h2>

      {patient?.tutors?.length > 0 &&
        patient?.tutors.map((tutor, i) => (
          <Popconfirm
            title={`Deseja definir ${selectedTutor?.name} como o tutor ativo?`}
            onConfirm={submitMainTutor}
            okText="Sim"
            cancelText="Não"
            placement="left"
          >
            <div
              key={i}
              onClick={() => setSelectedTutor(tutor)}
              className="uk-margin-small-top tutor-box"
            >
              {tutor.name}
            </div>
          </Popconfirm>
        ))}
      <hr />
      <footer className="uk-margin-top uk-flex uk-flex-right">
        <Button onClick={() => setVisible(false)}> Cancelar </Button>
      </footer>
    </Container>
  );
});

export default ActiveTutorsForm;
