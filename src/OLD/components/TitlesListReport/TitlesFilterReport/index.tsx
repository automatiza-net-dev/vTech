// @ts-nocheck
import React, { memo, useEffect } from "react";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { Container, InputBox } from "./styles";
import {
  Button as CustomButton,
  DateFilter,
} from "@/OLD/components/mini-components";
import { DatePicker, Select, Radio } from "antd";

const { Option } = Select;
const { Group } = Radio;

import moment from "moment";

const TitleFilterReports = memo(function TitleFilterReports({
  filters,
  setFilters,
  paymentMethods,
  plans,
  reload,
  setReload,
  clinics,
  loadingFinances,
}) {
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !loadingFinances) {
        setReload((prv) => !prv);
        setTitles([]);
      }
    });
  }, []);

  return (
    <Container className="uk-margin-top uk-flex">
      <div className="uk-width-1-3 uk-margin-right">
        <div>
          <div className="uk-flex">
            <label>Data emissão</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromIssueDate"}
              to={"toIssueDate"}
            />
          </div>
          <InputBox>
            <DatePicker
              value={filters?.fromIssueDate}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  fromIssueDate: e?.startOf("day") ?? null,
                });
              }}
              format="DD/MM/YYYY"
              className="date-component"
            />
            à
            <DatePicker
              value={filters?.toIssueDate}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  toIssueDate: e?.endOf("day") ?? null,
                });
              }}
              format="DD/MM/YYYY"
              className="date-component"
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <div className="uk-flex">
            <label>Data Vencimento</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromExpirationDate"}
              to={"toExpirationDate"}
            />
          </div>
          <InputBox>
            <DatePicker
              value={filters?.fromExpirationDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fromExpirationDate: e?.startOf("day") ?? null,
                })
              }
              format="DD/MM/YYYY"
              className="date-component"
            />
            <DatePicker
              value={filters?.toExpirationDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  toExpirationDate: e?.endOf("day") ?? null,
                })
              }
              format="DD/MM/YYYY"
              className="date-component"
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <div className="uk-flex">
            <label>Data Pagamento</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromPaymentDate"}
              to={"toPaymentDate"}
            />
          </div>
          <InputBox>
            <DatePicker
              value={filters?.fromPaymentDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fromPaymentDate: e?.startOf("day") ?? null,
                })
              }
              format="DD/MM/YYYY"
              className="date-component"
            />
            à{" "}
            <DatePicker
              value={filters?.toPaymentDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  toPaymentDate: e?.endOf("day") ?? null,
                })
              }
              format="DD/MM/YYYY"
              className="date-component"
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-3 uk-margin-right">
        <div>
          <label>Data competência</label>
          <InputBox>
            <DatePicker
              required
              className="uk-width-1-1"
              format="MM/YYYY"
              picker="month"
              onChange={(val) =>
                setFilters({
                  ...filters,
                  fromCompetenceDate: moment(val)
                    .startOf("month")
                    .toISOString(),
                  toCompetenceDate: moment(val).endOf("month").toISOString(),
                })
              }
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <label>Forma de pagamento</label>
          <InputBox>
            <Select
              allowClear
              value={
                paymentMethods.find(
                  (method) => method.id === filters?.paymentMethod
                )?.description
              }
              onChange={(e) => setFilters({ ...filters, paymentMethod: e })}
              className="uk-width-1-1"
              options={paymentMethods.map((method) => ({
                label: method.description,
                value: method.id,
              }))}
              filterOption={(value, option) =>
                normalizeStr(option.label.toUpperCase()).includes(
                  normalizeStr(value.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <label>Plano Contas</label>
          <InputBox>
            <Select
              allowClear
              value={
                plans.find((planDesc) => planDesc.id === filters?.accountPlan)
                  ?.description
              }
              onChange={(e) => setFilters({ ...filters, accountPlan: e })}
              className="uk-width-1-1"
              options={plans.map((plan) => ({
                label: plan.description,
                value: plan.id,
              }))}
              filterOption={(value, option) =>
                normalizeStr(option.label.toUpperCase()).includes(
                  normalizeStr(value.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-3 uk-margin-right">
        <div>
          <label>Tipo</label>
          <br />
          <Group
            defaultValue="all"
            onChange={(e) => {
              if (e.target.value === "all") {
                const obj = { ...filters };
                delete obj.type;
                return setFilters(obj);
              }
              setFilters({ ...filters, type: e.target.value });
            }}
          >
            <Radio value="all">Todos</Radio>
            <Radio value="CREDITO">Credito</Radio>
            <Radio value="DEBITO">Debito</Radio>
          </Group>
        </div>
        <div>
          <label>Situação</label>
          <br />
          <Group
            defaultValue="all"
            onChange={(e) => {
              if (e.target.value === "all") {
                const obj = { ...filters };
                delete obj.status;
                return setFilters(obj);
              }
              setFilters({ ...filters, status: e.target.value });
            }}
          >
            <Radio value="all">Todos</Radio>
            <Radio value="ABERTO">Aberto</Radio>
            <Radio value="BAIXADO">Baixado</Radio>
          </Group>
        </div>
        {/* Filial Filter */}
        <div className="uk-margin-top">
          <label>Unidade</label>
          <InputBox>
            <Select
              allowClear
              className="select-component"
              value={filters?.businessUnit}
              onChange={(e) => setFilters({ ...filters, businessUnit: e })}
            >
              {clinics?.length > 0 &&
                clinics?.map((clinic, i) => (
                  <Option key={i} value={clinic?.id}>
                    {clinic?.companyName}
                  </Option>
                ))}
            </Select>
          </InputBox>
        </div>

        {/* Ordenar por Filter */}
        {/*
        <div className="uk-margin-top">
          <label>Ordenar por</label>
          <InputBox>
            <Select
              value={filters?.order}
              className="select-component"
              onChange={(e) => setFilters({ ...filters, order: e })}
            >
              <Option value="expiration_date">Data Vencimento</Option>
              <Option value="issue_date">Data Emissão</Option>
              <Option value="competence_date">Data Competência</Option>
              <Option value="payment_date">Data Pagamento</Option>
              <Option value="doc">Documento / Parcela</Option>
            </Select>
          </InputBox>
        </div>
        */}
      </div>
    </Container>
  );
});

export default TitleFilterReports;
