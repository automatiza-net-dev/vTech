// @ts-nocheck
// Core
import React, { useState, memo, useCallback, useEffect } from "react";

// Services
import { vaccinesService } from "@/OLD/services/vaccine-service";

// Components
import { Modal, Input, Select, Button, Divider, notification } from "antd";
const { Option } = Select;

const dosageList = Array.from(Array(10), (_, i) => i + 1);

const CreateProtocol = memo(function CreateProtocol({
  visible,
  setVisible,
  species,
  vaccineId,
  reload,
  setReload,
  edit,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    edit ? setData({ ...edit, specieId: edit?.specie?.id }) : setData({});
  }, [edit]);

  const updateProtocol = useCallback(() => {
    setLoading(true);
    vaccinesService
      .updateProtocol(edit?.id, {
        name: data?.name,
        vaccineId: edit?.vaccine?.id,
        especieId: data?.specieId,
        doses: data?.doses,
        interval: data?.interval,
        active: data?.active,
      })
      .then((_res) =>
        notification.success({
          message: "Protocolo atualizado com suceeso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification({
          message: "Houve um erro ao atualizar as informações do protocolo...",
        });
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
        setReload(!reload);
      });
  });

  const submitProtocol = useCallback(() => {
    setLoading(false);
    vaccinesService
      .createVaccineProtocol({
        ...data,
        vaccineId,
        specieId: data?.specieId,
      })
      .then((_res) =>
        notification.success({
          message: "Protocolo registrado com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao registrar o protocolo...",
        });
      })
      .finally(() => {
        setLoading(false);
        setData({});
        setReload(!reload);
        setVisible(false);
      });
  });

  return (
    <Modal
      title="Adicionar Protocolo"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <form>
        <div className="uk-flex">
          <div className="uk-width-1-1">
            <label> Nome </label>
            <br />
            <Input
              value={data?.name}
              className="uk-width-2-3"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="uk-width-1-1">
            <label>Espécie</label>
            <br />
            <Select
              className="uk-width-2-3"
              value={
                data?.specieId
                  ? species.find((item) => item?.id === data?.specieId)
                      ?.description
                  : null
              }
              onChange={(e) => setData({ ...data, specieId: e })}
            >
              {species.length > 0 &&
                species.map((item, i) => (
                  <Option key={i} value={item?.id}>
                    {item?.description}
                  </Option>
                ))}
            </Select>
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-width-1-1">
            <label>Qtd. Doses</label>
            <br />
            <Select
              value={data?.doses ? `${data?.doses} Doses` : null}
              className="uk-width-2-3"
              placeholder="Selecione"
              onChange={(e) => setData({ ...data, doses: e })}
            >
              {dosageList.map((item, i) => (
                <Option key={i} value={item}>{`${item} Doses`}</Option>
              ))}
            </Select>
          </div>
          <div className="uk-width-1-1">
            <label> Intervalo (em dias) </label>
            <Input
              value={data?.interval}
              type="number"
              className="uk-width-2-3"
              onChange={(e) => setData({ ...data, interval: e.target.value })}
            />
          </div>
        </div>
        <Divider />
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button
              type="primary"
              onClick={() => {
                !edit ? submitProtocol() : updateProtocol();
              }}
            >
              Salvar
            </Button>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default CreateProtocol;
