// @ts-nocheck
// Core
import React, { memo } from "react";

// Hooks
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

// Utils
import moment from "moment";

// Components
import { DateFilter } from "@/OLD/components/mini-components";
import { Radio, Select, DatePicker, Input } from "antd";
import { Container, InputBox } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { currencyFormatter } from "@/OLD/components/Budget";
const { Group } = Radio;
const { Option } = Select;

const Filters = memo(function Filters({
  filters,
  setFilters,
  reload,
  setReload,
  firstItem,
  lastItem,
}) {
  const { checkingAccounts } = useCheckingAccounts();

  return (
    <Container className="uk-margin-top">
      <div className="uk-flex">
        <div>
          <div className="uk-flex">
            <div className="">
              <label>Tipo</label>
              <br />
              <Group
                defaultValue="all"
                onChange={(e) => {
                  if (e.target.value === "all") {
                    const newObj = { ...filters };
                    return setFilters(delete newObj?.type);
                  }
                  return setFilters({ ...filters, type: e.target.value });
                }}
              >
                <Radio value="CREDITO">Crédito</Radio>
                <Radio value="DEBITO">Débito</Radio>
                <Radio value="all">Todos</Radio>
              </Group>
            </div>
            <div className="uk-margin-left">
              <label>Conciliado</label>
              <br />
              <Group
                defaultValue="all"
                onChange={(e) =>
                  setFilters({ ...filters, reconciled: e.target.value })
                }
              >
                <Radio value="true">Sim</Radio>
                <Radio value="DEBITO">Não</Radio>
                <Radio value="all">Todos</Radio>
              </Group>
            </div>
            <div className="uk-width-1-4">
              <label>Conta corrente</label>
              <Select
                className="uk-width-1-1"
                onChange={(e) => {
                  if (e === "all") {
                    const newObj = { ...filters };
                    return setFilters(delete newObj?.account);
                  }
                  return setFilters({ ...filters, account: e });
                }}
              >
                <Option value="all">Todos</Option>
                {checkingAccounts?.length > 0 &&
                  checkingAccounts.map((account, i) => (
                    <Option key={i} value={account?.id}>
                      {account?.description}
                    </Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="uk-flex uk-margin-top">
            <div className="uk-width-1-4 uk-margin-right">
              <div className="uk-flex">
                <label>Data emissão</label>
                <DateFilter
                  state={filters}
                  setState={setFilters}
                  from={"from"}
                  to={"to"}
                />
              </div>
              <InputBox>
                <DatePicker
                  value={filters?.from}
                  onChange={(e) => setFilters({ ...filters, from: e })}
                  format="DD/MM/YYYY"
                  className="date-component"
                />
                à
                <DatePicker
                  value={filters.to}
                  onChange={(e) => setFilters({ ...filters, to: e })}
                  format="DD/MM/YYYY"
                  className="date-component"
                />
              </InputBox>
            </div>
            <div className="uk-margin-right">
              <label>Data competência</label>
              <InputBox>
                <DatePicker
                  required
                  className="uk-width-1-1"
                  format="MM/YYYY"
                  picker="month"
                  onChange={(e) => {
                    if (!e) {
                      const newObj = { ...filters };
                      delete newObj?.competence;
                      return setFilters(newObj);
                    }
                    return setFilters({
                      ...filters,
                      competence: moment(e).format("MM/YYYY"),
                    });
                  }}
                />
              </InputBox>
            </div>
            <div className="">
              <label>Documento</label>
              <InputBox>
                <Input
                  onChange={(e) =>
                    setFilters({ ...filters, document: e.target.value })
                  }
                />
              </InputBox>
            </div>
            <div className="uk-margin-top uk-margin-large-left">
              <CustomButton onClick={() => setReload(!reload)}>
                Filtrar
              </CustomButton>
            </div>
          </div>
        </div>
        {filters?.account && firstItem && lastItem && (
          <div className="inf-panel uk-padding-small">
            <p className="uk-margin-remove">
              Saldo inicial: {currencyFormatter(firstItem?.prev_balance)}
            </p>
            <p className="uk-margin-remove">
              Saldo final: {currencyFormatter(lastItem?.balance)}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
});

export default Filters;
