// @ts-nocheck
import React, { memo, useState } from "react";

import { usePlans } from "@/OLD/hooks/usePlans";

import { Input, Select, Button, Switch } from "antd";
const { Option } = Select;

const FormChild = memo(function FormChild({
  data,
  setData,
  submit,
  setVisible,
  plansGroup,
  groupFilters,
  setGroupFilters = false,
}) {
  const [filters, setFilters] = useState({});
  const { plans } = usePlans(filters);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <section>
        <div className="uk-margin-small-top uk-flex">
          <div className="uk-margin-small-right">
            <label>Código contábil</label>
            <Input
              value={data?.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
            />
          </div>
          <div className="uk-width-1-5 uk-flex uk-flex-column uk-flex-middle">
            <label>Ativo:&nbsp;</label>
            <Switch
              checked={data?.active}
              onChange={(e) => setData({ ...data, active: e })}
            />
          </div>

          <div className="uk-width-1-5 uk-flex uk-flex-column uk-flex-middle">
            <label>Lista DRE:&nbsp;</label>
            <Switch
              checked={data?.dre}
              onChange={(e) => setData({ ...data, dre: e })}
            />
          </div>
        </div>
        <div className="uk-margin-small-top">
          <label>Descrição</label>
          <Input
            required
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        <div className="uk-margin-small-top">
          <label>Tipo</label>
          <Select
            required
            className="uk-width-1-1"
            value={data?.type}
            onChange={(val) => {
              setData({ ...data, type: val });

              if (setGroupFilters) {
                setGroupFilters({ ...groupFilters, type: val });
                setFilters({ ...filters, type: val });
                setData({
                  ...data,
                  accountPlanGroupId: undefined,
                  parentId: undefined,
                  type: val,
                });
              }
            }}
          >
            <Option value="CREDITO">Crédito</Option>
            <Option value="DEBITO">Debito</Option>
          </Select>
        </div>
        <div className="uk-margin-small-top">
          <label>Grupo plano de contas</label>
          <Select
            required
            className="uk-width-1-1"
            onChange={(val) => setData({ ...data, accountPlanGroupId: val })}
            value={data?.accountPlanGroupId}
          >
            {plansGroup?.length > 0 &&
              plansGroup.map((group, i) => (
                <Option key={i} value={group?.id}>
                  {group?.description}
                </Option>
              ))}
          </Select>
        </div>
        <div className="uk-margin-small-top">
          <label>Plano de contas "Pai"</label>
          <Select
            className="uk-width-1-1"
            onChange={(val) => setData({ ...data, parentId: val })}
            value={data?.parentId}
          >
            {plans?.length > 0 &&
              plans.map((plan, i) => {
                if (!data?.id || plan?.id !== data?.id)
                  return (
                    <Option key={i} value={plan?.id}>
                      {plan?.description}
                    </Option>
                  );
              })}
          </Select>
        </div>
      </section>
      <hr />
      <footer className="uk-margin-top uk-flex uk-flex-right">
        <Button htmlType="submit" type="primary" className="uk-margin-right">
          Salvar
        </Button>
        <Button onClick={() => setVisible(false)}>Cancelar</Button>
      </footer>
    </form>
  );
});

export default FormChild;
