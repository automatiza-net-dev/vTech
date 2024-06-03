// @ts-nocheck
import React, { memo } from "react";

import { usePlans } from "@/OLD/hooks/usePlans";

import { Input as InputBox } from "./styles";
import { Select, Input } from "antd";
const { Option } = Select;

const Filters = memo(function Filters({ filters, setFilters, plansGroup }) {
  const { plans } = usePlans();

  return (
    <div className="uk-flex uk-flex-middle uk-width-1-1">
      <InputBox>
        <Input
          placeholder="Plano de contas"
          onChange={(e) =>
            setFilters({ ...filters, description: e.target.value })
          }
        />
      </InputBox>
      <div className="uk-margin-right uk-width-1-5">
        <Select
          placeholder="Grupo plano de contas"
          className="uk-width-1-1"
          onChange={(val) => {
            if (val === "all") {
              const newObj = { ...filters };
              return setFilters(delete newObj?.group);
            }
            setFilters({ ...filters, group: val });
          }}
        >
          <Option value="all">Todos</Option>
          {plansGroup?.length > 0 &&
            plansGroup.map((group, i) => (
              <Option key={i} value={group?.id}>
                {group?.description}
              </Option>
            ))}
        </Select>
      </div>
      <div className="uk-margin-right uk-width-1-6">
        <Select
          placeholder="Tipo"
          className="uk-width-1-1"
          onChange={(val) => {
            if (val === "all") {
              const newObj = { ...filters };
              return setFilters(delete newObj?.type);
            }
            setFilters({ ...filters, type: val });
          }}
        >
          <Option value="all">Todos</Option>
          <Option value="CREDITO">Crédito</Option>
          <Option value="DEBITO">Débito</Option>
        </Select>
      </div>
      <div className="uk-width-1-6 uk-margin-right">
        <Select
          className="uk-width-1-1"
          placeholder="Plano de contas Pai"
          onChange={(val) => {
            if (val === "all") {
              const newObj = { ...filters };
              return setFilters(delete newObj?.parent);
            }
            setFilters({ ...filters, parent: val });
          }}
        >
          <Option value="all">Todos</Option>
          {plans?.length > 0 &&
            plans?.map((plan, i) => (
              <Option key={i} value={plan?.id}>
                {plan?.description}
              </Option>
            ))}
        </Select>
      </div>
      <div className="uk-width-1-6 uk-margin-right">
        <Select
          placeholder="Ordenar por"
          className="uk-width-1-1"
          onChange={(val) => setFilters({ ...filters, orderBy: val })}
        >
          <Option value="description">Descrição</Option>
          <Option value="code">Código</Option>
          <Option value="type">Tipo</Option>
          <Option value="parent">Plano de contas pai</Option>
          <Option value="group">Grupo de plano de contas</Option>
        </Select>
      </div>
    </div>
  );
});

export default Filters;
