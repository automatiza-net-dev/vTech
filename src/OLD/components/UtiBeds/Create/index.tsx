// @ts-nocheck
// Core
import React, { useState, useCallback, useEffect } from "react";

// Services
import { bedsService } from "@/OLD/services/beds.service";

// Components
import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";
import { Modal, Input, Select, Switch, notification } from "antd";
const { Option } = Select;

function CreateBed({
  reload,
  setReload,
  visible,
  setVisible,
  updateData = false,
}) {
  const [data, setData] = useState({ active: true });
  const [loading, setLoading] = useState(false);

  const {createToast} = useToast()

  useEffect(() => {
    updateData && setData(updateData);
  }, [updateData]);

  const submitBed = useCallback(() => {
    setLoading(true);
    let error = false;
    bedsService
      .createBed({
        name: data?.name,
        tag: data?.tag,
        type: data?.type,
        active: data.active,
      })
      .then((_res) => {

        return createToast({ status: "success",  message: "Leito cadastrado com sucesso!" })
      })
      .catch((err) => {
        error = true;
        setLoading(false);

        return createToast({ status: "error",  message: `${err.response.data.errors[0].message}`, })
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setData({ active: true });
          setVisible(false);
          setReload(!reload);
        }
      });
  }, [data]);

  const submitUpdateBed = useCallback(() => {
    setLoading(true);
    let error = false;
    bedsService
      .updateBed(updateData.id, {
        name: data?.name,
        tag: data?.tag,
        type: data?.type,
        active: data.active,
      })
      .then((res) => {
        return createToast({ status: "success",  message:"Leito atualizado com sucesso!" })
      })
      .catch((err) => {
        error = true;
        setLoading(false);


        return createToast({ status: "error", message: `${err.response.data.errors[0].message}`,  })
      })
      .finally(() => {
        setLoading(false);
        if (!error) {
          setData({ active: true });
          setReload(!reload);
          setVisible(false);
        }
      });
  }, [data]);

  return (
    <Modal
      title="Leitos Internação"
      visible={visible}
      onCancel={() => {
        setData({ active: true });
        setVisible(false);
      }}
      footer={null}
      width={"50%"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          !updateData ? submitBed() : submitUpdateBed();
        }}
      >
        <div className="uk-flex uk-flex-between">
          <div className="uk-width-1-3">
            <label> Descrição do leito </label>
            <Input
              value={data?.tag}
              onChange={(e) => setData({ ...data, tag: e.target.value })}
            />
          </div>
          <div className="uk-width-1-2">
            <label>Sigla / Abreviação do leito</label>
            <Input
              value={data?.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
        </div>
        <div className="uk-flex uk-flex-between uk-margin-top">
          <div className="uk-width-1-3">
            <label>Tipo do leito</label>
            <br />
            <Select
              className="uk-width-1-1"
              value={data?.type}
              onChange={(e) => setData({ ...data, type: e })}
            >
              <Option value="HOSPITALIZATION">Internação</Option>
              <Option value="OBSERVATION">Observacao / Triagem</Option>
              <Option value="ICU">Uti</Option>
            </Select>
          </div>
          <div className="uk-width-1-3">
            <label className="uk-text-muted">Status</label>
            <br />
            <Switch
              checked={data?.active}
              onChange={(e) => {
                setData({ ...data, active: e });
              }}
            />
          </div>
        </div>
        <hr className="uk-margin-large-top" />
        <footer
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            justifyContent: "flex-end",
          }}
        >
          <Button type="submit" text="Salvar" />

          <Button
            onClick={() => {
              setData({ active: true });
              setVisible(false);
            }}
            text="Cancelar"
            type="button"
          />
        </footer>
      </form>
    </Modal>
  );
}

export default CreateBed;
