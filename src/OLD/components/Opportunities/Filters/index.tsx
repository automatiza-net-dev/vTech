// @ts-nocheck
import React, { useState, memo, useEffect } from "react";

import { useRouter } from "next/router";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Container, InputBox } from "./styles";
import { DateFilter } from "@/OLD/components/mini-components";
import { Input, AutoComplete, Select, Button } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";
import { currencyFormatter } from "@/OLD/components/Budget";

import { MdOutlineClear } from "react-icons/md";

const Filters = memo(function Filters({
  filters,
  setFilters,
  setReload,
  crmStatus,
  colaborators,
}) {
  const [values, setValues] = useState({});

  const { businessUnits } = useBusinessUnitsByUser(false);
  

  
  const router = useRouter();
  const newOpportunityPermission = useUserHasPermission("CRM01");
  const viewAllOpportunitiesPermission = useUserHasPermission("CRM09");

  sortItems(businessUnits, "fantasyName");
  sortItems(crmStatus, "description");

  /*
  useEffect(() => {
    setFilters({ ...filters, profit_value: 0 });
  }, []);
  */

  return (
    <Container className="">
      <section className="uk-flex uk-flex-around">
        <div>
          <div className="uk-flex uk-flex-center">
            <label>Data Contato</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"contactFrom"}
              to={"contactTo"}
            />
          </div>
          <InputBox>
            <DatePicker
              format="DD/MM/YYYY"
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.contactFrom}
              onChange={(val) => setFilters({ ...filters, contactFrom: val })}
            />
            &nbsp;à&nbsp;
            <DatePicker
              className="uk-margin-right"
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={filters?.contactTo}
              onChange={(val) => setFilters({ ...filters, contactTo: val })}
            />
            <MdOutlineClear
              size={30}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  contactTo: null,
                  contactFrom: null,
                }));
              }}
            />
          </InputBox>
        </div>
        <div className="uk-width-1-5">
          <label>Status</label>
          <InputBox className="uk-width-1-1">
            <Select
              mode="multiple"
              className="uk-width-1-1"
              value={filters?.status}
              onChange={(val) => {
                if (val === "all") {
                  const obj = { ...filters };
                  delete obj?.status;
                  return setFilters(obj);
                }
                setFilters({ ...filters, status: val });
                setReload((prv) => !prv);
              }}
            >
              <Option value="all">Todos</Option>
              {crmStatus.length > 0 &&
                crmStatus.map((status) => (
                  <Option value={status?.id} key={status?.id}>
                    {status?.description}
                  </Option>
                ))}
            </Select>
          </InputBox>
        </div>
        <div className="uk-width-1-5">
          <label>Ganho/Perda</label>
          <InputBox className="uk-width-1-1">
            <Select
              mode="multiple"
              className="uk-width-1-1"
              value={filters?.balance}
              onChange={(val) => {
                if (val === "all") {
                  const obj = { ...filters };
                  delete obj?.balance;
                  return setFilters(obj);
                }
                setFilters({ ...filters, balance: val });
                setReload((prv) => !prv);
              }}
            >
              <Option value="Ganho">Ganho</Option>
              <Option value="Perda">Perda</Option>
              <Option value="Em Aberto">Em aberto</Option>
            </Select>
          </InputBox>
        </div>
        {viewAllOpportunitiesPermission && (
          <div className="uk-width-1-5">
            <label>Prof. Resp.</label>
            <InputBox className="uk-width-1-1">
              <AutoComplete
                allowClear
                onClear={() => {
                  const newObj = { ...filters };
                  delete newObj?.technician;
                  setFilters(newObj);
                }}
                className="uk-width-1-1"
                options={[
                  { value: "Todos", id: "all" },
                  ...colaborators?.map((colab) => ({
                    ...colab,
                    value: colab?.name,
                    key: colab?.id,
                  })),
                ]}
                value={values?.technician}
                onChange={(val) => setValues({ ...values, technician: val })}
                onSelect={(_val, opt) => {
                  setValues({ ...values, technician: opt?.value });
                  if (opt?.id === "all") {
                    const obj = { ...filters };
                    delete obj?.technician;
                    return setFilters(obj);
                  }
                  setFilters({ ...filters, technician: opt?.id });
                  setReload((prv) => !prv);
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </InputBox>
          </div>
        )}
        <div className="uk-width-1-5">
          <label>Unidade</label>
          <InputBox className="uk-width-1-1">
            <Select
              mode="multiple"
              className="uk-width-1-1"
              value={filters?.unit}
              onChange={(val) => {
                setFilters({ ...filters, unit: val });
                setReload((prv) => !prv);
              }}
            >
              {businessUnits.length > 0 &&
                businessUnits.map((unit) => (
                  <Option value={unit?.id}>{unit?.fantasyName}</Option>
                ))}
            </Select>
          </InputBox>
        </div>
      </section>
      <section className="uk-flex uk-flex-around uk-margin-top">
        <div>
          <div className="uk-flex uk-flex-center">
            <label>Data Abertura</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"openingFrom"}
              to={"openingTo"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={filters?.openingFrom}
              onChange={(val) => setFilters({ ...filters, openingFrom: val })}
            />
            &nbsp;à&nbsp;
            <DatePicker
              className="uk-margin-right"
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={filters?.openingTo}
              onChange={(val) => setFilters({ ...filters, openingTo: val })}
            />
            <MdOutlineClear
              size={25}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  openingFrom: null,
                  openingTo: null,
                }));
              }}
            />
          </InputBox>
        </div>
        <div className="uk-width-1-5">
          <label>
            {process.env.client !== "liftone" ? "Nome tutor" : "Nome Cliente"}
          </label>
          <InputBox className="uk-width-1-1">
            <Input
              value={filters?.contactName}
              onChange={(e) =>
                setFilters({ ...filters, contactName: e.target.value })
              }
            />
            {/*
            allowClear
            onClear={() => {
              const newObj = { ...filters };
                delete newObj?.contactName;
                setFilters(newObj);
              }}
              className="uk-width-1-1"
              value={values?.contactName}
              options={[
                { value: "Todos", id: "all" },
                ...tutors?.map((tutor) => ({
                  ...tutor,
                  value: tutor?.name,
                  key: tutor?.id
                }))
              ]}
              onChange={(val) => setValues({ ...values, contactName: val })}
              onSelect={(_val, opt) => {
                setValues({ ...values, contactName: opt?.value });
                if (opt?.id === "all") {
                  const obj = { ...filters };
                  delete obj?.contactName;
                  return setFilters(obj);
                }
                setFilters({ ...filters, contactName: opt?.value });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val.toUpperCase())
                  )
                }
              */}
          </InputBox>
        </div>
        <div>
          <label>
            {process.env.client !== "liftone" ? "Fone Tutor" : "Fone cliente"}
          </label>
          <InputBox>
            <Input
              value={filters?.contactPhone}
              onChange={(e) =>
                setFilters({ ...filters, contactPhone: e.target.value })
              }
            />
          </InputBox>
        </div>
        {process.env.client !== "liftone" && (
          <div className="uk-width-1-5">
            <label>Nome pet</label>
            <InputBox className="uk-width-1-1">
              <Input
                value={filters?.patientName}
                onChange={(e) =>
                  setFilters({ ...filters, patientName: e.target.value })
                }
              />
              {/*
                className="uk-width-1-1"
                allowClear
                onClear={() => {
                  const newObj = { ...filters };
                  delete newObj?.patientName;
                  setFilters(newObj);
                }}
                options={[
                  { value: "Todos", id: "all" },
                  ...patients?.map((patient) => ({
                    ...patient,
                    value: patient?.name,
                    key: patient?.id
                  }))
                ]}
                value={values?.patientName}
                onChange={(val) => setValues({ ...values, patientName: val })}
                onSelect={(_val, opt) => {
                  setValues({ ...values, patientName: opt?.value });
                  if (opt?.id === "all") {
                    const obj = { ...filters };
                    delete obj?.patientName;
                    return setFilters(obj);
                  }
                  setFilters({ ...filters, patientName: opt?.value });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val).toUpperCase()
                  )
                }
              */}
            </InputBox>
          </div>
        )}
        <div className="uk-flex uk-flex-right uk-width-1-5 uk-margin-top">
          <Button
            onClick={() => {
              setFilters((prv) => ({ ...prv, noSearch: false }));
              setReload((prv) => !prv);
            }}
            type="primary"
            className="uk-margin-right uk-margin-small-top"
          >
            Filtrar
          </Button>
          <div style={{ display: "block" }}>
            <CustomButton
              onClick={() => router.push("/crm/oportunidades/nova")}
            >
              Nova oportunidade
            </CustomButton>
          </div>
        </div>
      </section>
    </Container>
  );
});

export default Filters;
