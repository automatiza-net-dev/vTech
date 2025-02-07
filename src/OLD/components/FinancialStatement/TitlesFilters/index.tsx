import React, { useState, useEffect } from "react";

import { useAuth } from "@/OLD/hooks/useAuth";

import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { MdOutlineClear } from "react-icons/md";

import { Container, InputBox } from "./styles";
import { Input, Select, Radio, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { DateFilter } from "../../mini-components";
import { FormHandler, InputDateRange } from "infinity-forge";
const { Option } = Select;
const { Group } = Radio;

function TitlesFilters({
  filters,
  setFilters,
  paymentMethods,
  plans,
  tutors,
  reload,
  suppliers,
  setReload,
  clinics,
  loadingFinances,
  checkingAccounts,
  tefFlags,
}: any) {
  const [formatedTutors, setFormatedTutors] = useState([]);
  const [values, setValues] = useState<any>({});

  const { setTitles } = useAuth();

  sortItems(checkingAccounts, "description");
  sortItems(plans, "description");
  sortItems(suppliers, "name");
  sortItems(tutors, "name");
  sortItems(tefFlags, "description");

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !loadingFinances) {
        setReload((prv) => !prv);
        setTitles([]);
      }
    });
  }, []);

  const formatTutors = () => {
    const formattedTutors =
      tutors?.map((tutor) => ({
        ...tutor,
        value: tutor?.name,
      })) || [];

    const formattedSuppliers = Array.isArray(suppliers)
      ? suppliers.map((supplier) => ({
          ...supplier,
          value: supplier?.name,
        }))
      : [];

    const formattedClients = [...formattedTutors, ...formattedSuppliers];

    const sortedClients: any = formattedClients.sort((a, b) => {
      const nameA = a.value.toUpperCase();
      const nameB = b.value.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    setFormatedTutors(sortedClients);
  };

  useEffect(() => {
    if (tutors?.length > 0 || Array.isArray(suppliers)) {
      formatTutors();
    }
  }, [tutors, suppliers]);

  return (
    <Container className="uk-margin-top uk-flex">

      <FormHandler
        cleanFieldsOnSubmit={false}
        initialData={filters}
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
          names={["fromIssue", "toIssue"]}
          isClearable
        />

<InputDateRange
          enableFilter
          id="DateExp"
          placeholder="DD/MM/YYYY"
          label="Data Vencimento"
          names={["fromExpiration", "toExpiration"]}
          isClearable
        />

<InputDateRange
          enableFilter
          id="DateExpPag"
          placeholder="DD/MM/YYYY"
          label="Data Pagamento"
          names={["fromPayment", "toPayment"]}
          isClearable
        />
      </FormHandler>
    
  

      <div className="uk-width-1-5 uk-margin-right">
        <div className="uk-flex">
          <div className="">
            <label>Data competência</label>
            <InputBox>
              <DatePicker
                slotProps={{ textField: { variant: "standard" } }}
                className="uk-width-1-1"
                format="MM/YYYY"
                value={filters?.competence}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    competence: moment(e),
                  })
                }
              />
              <MdOutlineClear
                size={30}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFilters((prv) => ({
                    ...prv,
                    competence: null,
                  }));
                }}
              />
            </InputBox>
          </div>
          <div className="uk-margin-small-left">
            <label>Comprov. / NSU</label>
            <InputBox>
              <Input
                onChange={(e) =>
                  setFilters({ ...filters, nsu: e.target.value })
                }
                value={filters?.nsu}
              />
            </InputBox>
          </div>
        </div>
        <div className="uk-margin-small-top uk-flex">
          <div className="uk-margin-small-right">
            <label>Documento</label>
            <InputBox>
              <Input
                value={filters?.document}
                onChange={(e) =>
                  setFilters({ ...filters, document: e.target.value })
                }
              />
            </InputBox>
          </div>
          <div>
            <label>Nota Fiscal</label>
            <InputBox>
              <Input
                value={filters?.fiscalNote}
                onChange={(e) =>
                  setFilters({ ...filters, fiscalNote: e.target.value })
                }
              />
            </InputBox>
          </div>
        </div>
        <div className="uk-margin-small-right uk-width-1-1">
          <label>Nome do Titular</label>
          <InputBox>
            <AutoComplete
              options={formatedTutors}
              className="uk-width-1-1"
              onChange={(e) => {
                setFilters({ ...filters, client: e });
              }}
              onSelect={(inputValue, option: any) =>
                setFilters({ ...filters, client: option.id })
              }
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-5 uk-margin-right">
        <div className="">
          <label>Forma de pagamento</label>
          <InputBox>
            <AutoComplete
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
              filterOption={(value, option: any) =>
                normalizeStr(option.label.toUpperCase()).includes(
                  normalizeStr(value.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <label>Bandeira Tef.</label>
          <InputBox>
            <AutoComplete
              className="uk-width-1-1"
              options={tefFlags?.map((flag) => ({
                ...flag,
                value: flag?.description,
              }))}
              onChange={(val) =>
                setValues((prv) => ({ ...prv, flagDescription: val }))
              }
              onSelect={(_, opt) => {
                setValues((prv) => ({ ...prv, flagDescription: opt?.value }));
                setFilters((prv) => ({ ...prv, tefFlagId: opt?.id }));
              }}
              value={values?.flagDescription}
              filterOption={(value, option: any) =>
                normalizeStr(option?.value?.toUpperCase()).includes(
                  normalizeStr(value.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <label>Conta corrente</label>
          <InputBox>
            <AutoComplete
              className="uk-width-1-1"
              options={checkingAccounts?.map((account) => ({
                ...account,
                value: account?.description,
              }))}
              value={values?.accountDescription}
              onChange={(val) =>
                setValues((prv) => ({ accountDescription: val }))
              }
              onSelect={(_, opt) => {
                setValues((prv) => ({
                  ...prv,
                  accountDescription: opt?.value,
                }));
                setFilters((prv) => ({ ...prv, checkingAccountId: opt?.id }));
              }}
              filterOption={(value, option: any) =>
                normalizeStr(option.value.toUpperCase()).includes(
                  normalizeStr(value.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-5 uk-margin-right">
        <div>
          <div>
            <label>Tipo título</label>
            <br />
            <Group
              defaultValue="all"
              onChange={(e) => {
                if (e.target.value === "all") {
                  const newObj = { ...filters };
                  delete newObj?.type;
                  setFilters(newObj);
                }
                setFilters({ ...filters, type: e.target.value });
              }}
            >
              <Radio value="all">Todos</Radio>
              <Radio value="CREDITO">Crédito</Radio>
              <Radio value="DEBITO">Débito</Radio>
            </Group>
          </div>
          <div className="uk-margin-small-top">
            <label>Situação</label>
            <br />
            <Group
              defaultValue="ABERTO"
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
          <div className="uk-margin-small-top">
            <label>Plano Contas</label>
            <InputBox>
              <AutoComplete
                value={
                  plans.find((planDesc) => planDesc.id === filters?.plan)
                    ?.description
                }
                onChange={(e) => setFilters({ ...filters, plan: e })}
                className="uk-width-1-1"
                options={plans.map((plan) => ({
                  label: plan.description,
                  value: plan.id,
                }))}
                filterOption={(value, option: any) =>
                  normalizeStr(option.label.toUpperCase()).includes(
                    normalizeStr(value.toUpperCase())
                  )
                }
              />
            </InputBox>
          </div>
          {/*
          <div className="uk-margin-small-top">
            <label>Agrupa títulos borderô</label>
            <br />
            <Group
              value={filters?.groupBorderos}
              onChange={(e) =>
                setFilters({ ...filters, groupBorderos: e.target.value })
              }
            >
              <Radio value="sim">Sim</Radio>
              <Radio value="nao">Não</Radio>
            </Group>
          </div>
          */}
        </div>
      </div>
      <div className="uk-width-1-5">
        <div className="">
          <label>Aceito</label>
          <br />
          <Group
            defaultValue="all"
            onChange={(e) => {
              if (e.target.value === "all") {
                const obj = { ...filters };
                delete obj.accept;
                return setFilters(obj);
              }
              setFilters({ ...filters, accept: e.target.value });
            }}
          >
            <Radio value="all">Todos</Radio>
            <Radio value="SIM">Sim</Radio>
            <Radio value="NAO">Não</Radio>
          </Group>
        </div>
        <div className="uk-margin-small-top">
          <label>Conciliado</label>
          <br />
          <Group
            defaultValue="all"
            onChange={(e) =>
              setFilters({ ...filters, reconciled: e.target.value })
            }
          >
            <Radio value="all">Todos</Radio>
            <Radio value="true">Sim</Radio>
            <Radio value="false">Não</Radio>
          </Group>
        </div>
        <div className="uk-margin-small-top">
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
        {/*<div className="uk-margin-top uk-flex uk-flex-right">
        
          </div>*/}
      </div>
    </Container>
  );
}

export default TitlesFilters;
