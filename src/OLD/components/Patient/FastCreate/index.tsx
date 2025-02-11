// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Masks from "@/OLD/utils/masks";
import { petsService } from "@/OLD/services/patient.service";
import { useRaces } from "@/OLD/hooks/useRaces";
import { useToast } from "infinity-forge";



const FastCreatePatient = React.memo(function FastCreatePatient({
  visible,
  setVisible,
  fetchData,
  payload,
  setPayload,
  tutorId,
}) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({ description: "" });
  const submitButton = useRef();

  const {createToast} = useToast()

  const { races } = useRaces(filter, reload, setReload, false, visible);

  const submitData = useCallback(() => {
    setLoading(true);
    petsService
      .createPatient({ ...data, holderId: tutorId })
      .then((res) => {
        fetchData();

        createToast({ status: "success", message: "Paciente cadastrado!" })
      
        setPayload({
          ...payload,
          patient_id: res.data.id,
        });
        setVisible(false);
      })
      .catch((err) => {
       

        createToast({ status: "error", message: "Erro ao cadastrar paciente" })
      
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, loading, payload, tutorId]);

  return (
    <Modal
      visible={visible}
      confirmLoading={loading}
      onCancel={() => setVisible(false)}
      onOk={() => submitButton.current.click()}
      title="Cadastro rápido de paciente"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitData();
        }}
      >
        <div className="uk-margin-small">
          <label>Nome</label>
          <input
            className="uk-input"
            type="text"
            placeholder="Digite o nome completo"
            value={data?.name}
            onChange={(e) =>
              setData({
                ...data,
                name: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="uk-margin-small">
          <label>Raça</label>
          <select
            className="uk-select"
            value={data?.raceId}
            onChange={(e) => setData({ ...data, raceId: e.target.value })}
          >
            <option value="">Selecione uma opção</option>
            {(races || []).map((item, i) => (
              <option value={item.id}>{item.description}</option>
            ))}
          </select>
        </div>
        <div className="uk-margin-small">
          <label>Gênero</label>
          <select
            id={"gender"}
            className="uk-select"
            value={data?.gender}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
          >
            <option value="macho">Macho</option>
            <option value="femea">Fêmea</option>
          </select>
        </div>
        <button className="uk-hidden" type="submit" ref={submitButton}></button>
      </form>
    </Modal>
  );
});

FastCreatePatient.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default FastCreatePatient;
