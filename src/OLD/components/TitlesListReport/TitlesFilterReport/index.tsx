// @ts-nocheck
import React, { memo, useEffect } from "react";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { Container, InputBox } from "./styles";
import { DateFilter } from "@/OLD/components/mini-components";
import { DatePicker, Select, Radio } from "antd";
import { Button, FormHandler, InputDateRange } from "infinity-forge";

const { Option } = Select;
const { Group } = Radio;

import moment from "moment";

function TitleFilterReports({
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
      <div style={{ marginRight: 20 }}>
      <FormHandler
        cleanFieldsOnSubmit={false}
        onChangeForm={{
          callbackResult: (formValues) => {
            setFilters(formValues);
          },
        }}
      >
        <InputDateRange
          enableFilter
          id="Date"
          placeholder="DD/MM/YYYY"
          label="Data emissão"
          names={["fromIssueDate", "toIssueDate"]}
          isClearable
        />

        <InputDateRange
          enableFilter
          id="Date"
          placeholder="DD/MM/YYYY"
          label="Data Vencimento"
          names={["fromExpirationDate", "toExpirationDate"]}
          isClearable
        />

        <InputDateRange
          enableFilter
          id="Date"
          placeholder="DD/MM/YYYY"
          label="Data Pagamento"
          names={["fromPaymentDate", "toPaymentDate"]}
          isClearable
        />
      </FormHandler>
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
}

export default TitleFilterReports;
