// @ts-nocheck
import React, { memo, useState } from "react";

import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useActivitiesTypes } from "@/OLD/hooks/useActivitiesTypes";

import { Container } from "./styles";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Input,
  Select,
  AutoComplete,
  notification,
  Button,
  Switch,
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

import { normalizeStr } from "@/OLD/utils/normalizeString";

const verifyFields = (data) => {
  if (!data?.userId) {
    return notification.warning({ message: "informe o proprietário" });
  }

  if (!data?.activityId) {
    return notification.warning({ message: "Informe o tipo de atividade" });
  }

  if (!data?.executionDate) {
    return notification.warning({
      message: "Informe a data e horário da atividade",
    });
  }

  if (!data?.duration) {
    return notification.warning({ message: "informe a duração da atividade" });
  }

  return "ok";
};

const FormChild = memo(function FormChild({
  data,
  setData,
  submit,
  loading,
  setVisible,
  type = "create",
  setExecution,
  edit,
  op,
  colaborators,
  actTypes,
}) {
  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
        verifyFields(data) === "ok" && submit();
      }}
    >
      <div className="uk-flex uk-flex-between">
        <div className="uk-margin-small-right uk-width-2-3">
          <label>Cliente</label>
          <Input value={op?.client?.name || op?.contact?.name} disabled />
        </div>
        <div>
          <label>Telefone</label>
          <Input
            value={op?.contact?.cellphone || op?.contact?.tutor?.cellphone}
            disabled
          />
        </div>
      </div>
      <div className="uk-margin-small-top">
        <label>Título oportunidade</label>
        <Input value={op?.description} disabled />
      </div>
      <div className="uk-flex uk-flex-between uk-margin-small-top">
        <div className="uk-width-2-3">
          <label>Proprietário</label>
          <AutoComplete
            disabled={!edit}
            className="uk-width-1-1"
            options={colaborators.map((collab) => ({
              ...collab,
              value: collab?.name,
              key: collab?.id,
            }))}
            value={data?.collabName}
            onChange={(val) => setData({ ...data, collabName: val })}
            onSelect={(_, opt) => {
              setData({ ...data, userId: opt?.id, collabName: opt?.value });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
        </div>
      </div>
      <section className="uk-flex uk-flex-between uk-margin-small-top">
        <div className="uk-width-1-1 uk-margin-small-right">
          <label>Atividade</label>
          <Select
            disabled={!edit}
            className="uk-width-1-1"
            value={data?.activityId}
            onChange={(val) => {
              setData({
                ...data,
                activityId: val,
                duration: actTypes?.find((item) => item?.id === val)?.duration,
              });
            }}
          >
            {actTypes?.length > 0 &&
              actTypes.map((type) => (
                <Option value={type?.id}>{type?.description}</Option>
              ))}
          </Select>
        </div>
      </section>
      <section className="uk-flex uk-flex-between uk-margin-small-top">
        <div className="uk-width-1-2 uk-margin-small-right">
          <label>Data e hora</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            disabled={!edit}
            className="uk-width-1-1"
            format="DD/MM/YYYY - HH:mm"
            showTime
            value={data?.executionDate}
            onChange={(val) => setData({ ...data, executionDate: val })}
          />
        </div>
        <div className="uk-width-1-3">
          <label>Duração (Min.)</label>
          <Input
            disabled={!edit}
            type="number"
            value={data?.duration}
            onChange={(e) => setData({ ...data, duration: e.target.value })}
          />
        </div>
      </section>
      <div className="uk-flex">
        <div
          className={`uk-margin-small-top uk-width-1-${
            type === "update" ? "2 uk-margin-small-right" : "1"
          }`}
        >
          <label>Anotações</label>
          <TextArea
            disabled={!edit}
            value={data?.description}
            autoSize={{ minRows: 6 }}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        {type === "update" && (
          <div className="uk-margin-small-top uk-width-1-2">
            <label>Observações conclusão Ativ.</label>
            <TextArea
              disabled={!edit}
              value={data?.execObservation}
              autoSize={{ minRows: 6 }}
              onChange={(e) =>
                setData({ ...data, execObservation: e.target.value })
              }
            />
          </div>
        )}
      </div>
      <hr />
      {edit && (
        <footer className="uk-margin-top uk-flex">
          <div
            className={`uk-flex uk-flex-right ${
              type === "update" && "uk-width-1-2"
            }`}
          >
            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              className="uk-margin-right"
            >
              Salvar
            </Button>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
          </div>
          {type === "update" && (
            <div className="uk-flex uk-flex-right uk-width-1-2">
              <Button
                htmlType="submit"
                onClick={() => setExecution(true)}
                type="primary"
              >
                {" "}
                Finalizar e salvar
              </Button>
            </div>
          )}
        </footer>
      )}
    </Container>
  );
});

export default FormChild;
