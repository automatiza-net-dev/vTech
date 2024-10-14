// @ts-nocheck
import React from "react";

import { useLoadAllDreGroups } from "@/presentation";

import { Switch, Select, Button, Input } from "antd";
const { Option } = Select;

function FormChild({ data, setData, submit, setVisible }) {
  const dreGroups = useLoadAllDreGroups();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <section className="uk-width-1-1 uk-flex">
          <div className="uk-width-4-5 uk-margin-right">
            <label>Nome grupo plano de contas</label>
            <Input
              required
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <label>Ativo</label>
            <Switch
              checked={data?.active}
              onChange={(e) => setData({ ...data, active: e.target.checked })}
            />
          </div>
        </section>
        <div className="uk-margin-small-top">
          <label>Tipo</label>
          <Select
            required
            className="uk-width-1-1"
            value={data?.type}
            onChange={(val) => setData({ ...data, type: val })}
          >
            <Option value="CREDITO">Crédito</Option>
            <Option value="DEBITO">Débito</Option>
            <Option value="AMBOS">Ambos</Option>
          </Select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Agrupamento DRE</label>
          <Select
            style={{ width: "100%" }}
            required
            value={data?.dreGroupId}
            onChange={(val) => setData({ ...data, dreGroupId: val })}
          >
            {dreGroups?.data?.map((group) => (
              <Option value={group?.id}>{group?.description}</Option>
            ))}
          </Select>
        </div>
        <hr />
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <Button type="primary" htmlType="submit" className="uk-margin-right">
            Salvar
          </Button>
          <Button onClick={() => setVisible(false)}>Cancelar</Button>
        </footer>
      </form>
    </div>
  );
}

export default FormChild;
