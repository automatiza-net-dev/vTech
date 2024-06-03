// @ts-nocheck
import React, { memo } from "react";

import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

import { Select, Button, Switch, Input, Form } from "antd";
const { Option } = Select;
const { TextArea } = Input;

const Edit = memo(function ({ data, setData, setVisible, submit }) {
  const { subgroups } = useSubgroups();
  const { taxationGroups } = useTaxationGroups();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <section className="uk-flex">
        <div className="uk-margin-right uk-width-5-6">
          <Form.Item
            label="Descrição"
            labelAlign="left"
            required
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Input
              required
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-center">
          <Form.Item
            label="Ativo"
            labelAlign="left"
            required
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Switch
              required
              checked={data?.active === "true" ? true : false}
              onChange={(e) => setData({ ...data, active: `${e.checked}` })}
            />
          </Form.Item>
        </div>
      </section>
      <section className="uk-flex uk-margin-top">
        <div className="uk-width-1-2 uk-margin-right">
          <Form.Item
            label="Código de Referência"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Input
              value={data?.referenceCode}
              onChange={(e) =>
                setData({ ...data, referenceCode: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="uk-width-1-2">
          <Form.Item
            label="Subgrupo"
            required
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Select
              value={data.subgroupId}
              className="uk-width-1-1"
              placeholder="Selecione"
              allowClear
              onChange={(val) => setData({ ...data, subgroupId: val })}
            >
              {subgroups.length > 0 &&
                subgroups.map((subgroup) => (
                  <Option value={subgroup?.id} key={subgroup?.id}>
                    {subgroup?.description}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
      </section>
      <div className="uk-flex uk-flex-row uk-margin-small-top">
        <div className="uk-width-1-1 uk-margin-right">
          <Form.Item
            label="Grupo de Imposto"
            required
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Select
              required
              allowClear
              value={data?.taxationGroupId}
              onChange={(val) => setData({ ...data, taxationGroupId: val })}
              className="uk-width-1-1"
            >
              {taxationGroups?.length > 0 &&
                taxationGroups?.map((taxationGroup) => (
                  <Option value={taxationGroup?.id}>
                    {taxationGroup?.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="uk-width-1-1">
          <Form.Item
            label="Código do Serviço"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Input
              value={data?.serviceCode}
              onChange={(e) =>
                setData({ ...data, serviceCode: e.target.value })
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="uk-flex uk-margin-top">
        <div className="uk-width-1-2 uk-margin-right">
          <Form.Item
            label="Características"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <TextArea
              value={data?.features}
              onChange={(e) => setData({ ...data, features: e.target.value })}
            />
          </Form.Item>
        </div>
        <div className="uk-width-1-2">
          <Form.Item
            label="Tipo Serviço"
            labelAlign="left"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Select
              className="uk-width-1-1"
              onChange={(val) => setData({ ...data, serviceType: val })}
            >
              <Option value="service">Serviço</Option>
              <Option value="exam">Exame</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button type="primary" htmlType="submit" className="uk-margin-right">
          Salvar
        </Button>
        <Button
          onClick={() => {
            setVisible(false);
            setData({});
          }}
        >
          Cancelar
        </Button>
      </footer>
    </form>
  );
});

export default Edit;
