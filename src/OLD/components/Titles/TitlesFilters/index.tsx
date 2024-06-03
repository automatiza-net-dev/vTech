// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";

// Hooks
import { useAuth } from "@/OLD/hooks/useAuth";

// Utils
import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { MdOutlineClear } from "react-icons/md";

// Components
import { Container, InputBox } from "./styles";
import {
  Button as CustomButton,
  DateFilter,
} from "@/OLD/components/mini-components";
import { Input, Select, Radio, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
const { Option } = Select;
const { Group } = Radio;

const TitlesFilters = memo(function TitlesFilters({
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
}) {
  const [formatedTutors, setFormatedTutors] = useState([]);

  const { setTitles } = useAuth();

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

    const sortedClients = formattedClients.sort((a, b) => {
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
      <div className="uk-width-1-5 uk-margin-right">
        <div>
          <div className="uk-flex">
            <label>Data emissão</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromIssue"}
              to={"toIssue"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{
                textField: { variant: "standard" },
              }}
              value={filters?.fromIssue}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  fromIssue: e?.startOf("day") ?? null,
                });
              }}
              className="date-component"
            />
            à
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.toIssue}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  toIssue: e?.endOf("day") ?? null,
                });
              }}
              className="date-component"
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  fromIssue: null,
                  toIssue: null,
                }));
              }}
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <div className="uk-flex">
            <label>Data Vencimento</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromExpiration"}
              to={"toExpiration"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.fromExpiration}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fromExpiration: e?.startOf("day") ?? null,
                })
              }
              className="date-component"
            />
            à
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.toExpiration}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  toExpiration: e?.endOf("day") ?? null,
                })
              }
              className="date-component"
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  fromExpiration: null,
                  toExpiration: null,
                }));
              }}
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
          <div className="uk-flex">
            <label>Data Pagamento</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromPayment"}
              to={"toPayment"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.fromPayment}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fromPayment: e?.startOf("day") ?? null,
                })
              }
              className="date-component"
            />
            à{" "}
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.toPayment}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  toPayment: e?.endOf("day") ?? null,
                })
              }
              className="date-component"
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  fromPayment: null,
                  toPayment: null,
                }));
              }}
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-5 uk-margin-right">
        <div>
          <label>Data competência</label>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              required
              className="uk-width-1-1"
              format="MM/YYYY"
              picker="month"
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
        <div className="uk-margin-small-top uk-flex">
          <div className="uk-margin-small-right">
            <label>Documento</label>
            <InputBox>
              <Input
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
        <div className="uk-margin-small-top">
          <label>Nº Comprovante / NSU</label>
          <InputBox>
            <Input
              onChange={(e) => setFilters({ ...filters, nsu: e.target.value })}
              value={filters?.nsu}
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-width-1-5 uk-margin-right">
        <div className="uk-margin-small-right uk-width-1-1">
          <label>Nome do Titular</label>
          <InputBox>
            <AutoComplete
              required
              options={formatedTutors}
              className="uk-width-1-1"
              onChange={(e) => {
                setFilters({ ...filters, client: e });
              }}
              onSelect={(inputValue, option) =>
                setFilters({ ...filters, client: option.id })
              }
              filterOption={(inputValue, option) =>
                normalizeStr(option.value)
                  .toUpperCase()
                  .includes(normalizeStr(inputValue).toUpperCase())
                  ? option
                  : null
              }
            />
          </InputBox>
        </div>
        <div className="uk-margin-small-top">
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
              filterOption={(value, option) =>
                normalizeStr(option.label.toUpperCase()).includes(
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
            <label>Agrupa títulos borderô</label>
            <br />
            <Group
              defaultValue="sim"
              onChange={(e) =>
                setFilters({ ...filters, groupBorderos: e.target.value })
              }
            >
              <Radio value="sim">Sim</Radio>
              <Radio value="false">Não</Radio>
            </Group>
          </div>
        </div>
      </div>
      <div className="uk-width-1-5">
        <div>
          <label>Filial</label>
          <InputBox>
            <Select
              value={filters?.unit}
              className="select-component"
              onChange={(e) => setFilters({ ...filters, unit: e })}
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
        <div className="uk-margin-top uk-flex uk-flex-rightt">
          <CustomButton
            type="primary"
            onClick={() => {
              setFilters({ ...filters, noSearch: false });
              setTitles([]);
              setReload(!reload);
            }}
            classCallback="uk-margin-right"
          >
            Filtrar
          </CustomButton>
        </div>
      </div>
    </Container>
  );
});

export default TitlesFilters;
