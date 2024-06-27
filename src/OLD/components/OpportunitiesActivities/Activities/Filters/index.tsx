// @ts-nocheck
import { useState, memo } from "react";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container, InputBox } from "./styles";
import { DateFilter } from "@/OLD/components/mini-components";
import { Input, Button, AutoComplete, Select } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { MdOutlineClear } from "react-icons/md";

const Filters = memo(function Filters({
  filters,
  setFilters,
  setReload,
  actTypes,
  colaborators,
}) {
  const [values, setValues] = useState({});

  const viewAllActivitiesPermission = useUserHasPermission("CRM09");

  return (
    <Container className="uk-margin-top">
      <section className="uk-flex uk-flex-around">
        <div>
          <div className="uk-flex uk-flex-center">
            <label>Data Atividade</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"fromDate"}
              to={"toDate"}
            />
          </div>
          <InputBox>
            <DatePicker
              format="DD/MM/YYYY"
              className="custom-date-component"
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.fromDate}
              onChange={(val) => setFilters({ ...filters, fromDate: val })}
            />
            &nbsp;à&nbsp;
            <DatePicker
              className="uk-margin-right custom-date-component"
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={filters?.toDate}
              onChange={(val) => setFilters({ ...filters, toDate: val })}
            />
            <MdOutlineClear
              size={25}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  fromDate: null,
                  toDate: null,
                }));
              }}
            />
          </InputBox>
        </div>
        <div className="uk-width-1-4">
          <label>Atividade</label>
          <InputBox>
            <AutoComplete
              className="uk-width-1-1"
              allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.description;
                setFilters(newObj);
              }}
              value={filters?.description}
              options={actTypes?.map((type) => ({
                ...type,
                value: type?.description,
              }))}
              onChange={(val) => setFilters({ ...filters, description: val })}
              onSelect={(_val, opt) => {
                setFilters({ ...filters, description: opt?.value });
                setReload((prv) => !prv);
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value?.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
        <div className="uk-width-1-4">
          <label>Status</label>
          <InputBox>
            <Select
              className="uk-width-1-1"
              value={filters?.status}
              onChange={(val) => {
                setFilters({ ...filters, status: val });
                setReload((prv) => !prv);
              }}
            >
              <Option value="all">Todos</Option>
              <Option value="Aberta">Em aberto</Option>
              <Option value="Executada">Executada</Option>
            </Select>
          </InputBox>
        </div>
      </section>
      <section className="uk-flex uk-flex-around uk-margin-top">
        {viewAllActivitiesPermission && (
          <div className="uk-width-1-3 uk-margin-small-right">
            <label>Profissional Responsável</label>
            <InputBox className="uk-width-1-1">
              <AutoComplete
                className="uk-width-1-1"
                allowClear
                onClear={() => {
                  const newObj = { ...filters };
                  delete newObj?.technicianName;
                  setFilters(newObj);
                }}
                placeholder="Prof. resp."
                value={values?.techName}
                options={colaborators?.map((colab) => ({
                  ...colab,
                  value: colab?.name,
                  key: colab?.id,
                }))}
                onChange={(val) => {
                  const newObj = { ...filters };
                  setValues({ ...values, techName: val });
                  delete newObj?.technicianName;
                  setFilters(newObj);
                }}
                onSelect={(_val, opt) => {
                  setValues({ ...values, techName: opt?.value });
                  setFilters({ ...filters, technicianName: opt?.value });
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
        <div className="uk-width-1-3 uk-margin-small-right">
          <label>
            Nome {process.env.client !== "liftone" ? "Tutor" : "Cliente"}
          </label>
          <InputBox>
            <Input
              value={filters?.contactName}
              onChange={(e) =>
                setFilters((prv) => ({ ...prv, contactName: e.target.value }))
              }
            />
            {/*
            className="uk-width-1-1"
            allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.contactName;
                setFilters(newObj);
              }}
              value={values?.contactName}
              placeholder={`Nome do ${
                process.env.client !== "liftone" ? "Tutor" : "Cliente"
              }`}
              options={tutors?.map((tutor) => ({
                ...tutor,
                value: tutor?.name,
                key: tutor?.id
              }))}
              onChange={(val) => {
                const newObj = { ...filters };
                setValues({ ...values, contactName: val });
                delete newObj?.contactName;
                setFilters(newObj);
              }}
              onSelect={(_val, opt) => {
                setValues({ ...values, contactName: opt?.value });
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
        {/*
        <div>
          <label>Fone Contato</label>
          <InputBox>
            <Input
              value={filters?.contactPhone}
              onChange={(e) =>
                setFilters({ ...filters, contactPhone: e.target.value })
              }
            />
          </InputBox>
        </div>
        */}
        {process.env.client !== "liftone" && (
          <div className="uk-width-1-3">
            <label>Nome pet</label>
            <InputBox>
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
                value={values?.patientName}
                placeholder="Nome do pet"
                options={patients?.map((patient) => ({
                  ...patient,
                  value: patient?.name,
                  key: patient?.id
                }))}
                onChange={(val) => {
                  const newObj = { ...filters };
                  setValues({ ...values, patientName: val });
                  delete newObj?.patientName;
                  setFilters(newObj);
                }}
                onSelect={(_val, opt) => {
                  setValues({ ...values, patientName: opt?.value });
                  setFilters({ ...filters, patientName: opt?.value });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                    )
                  }
                */}
            </InputBox>
          </div>
        )}
        <div className="uk-flex uk-flex-right uk-flex-bottom" type="primary">
          <Button
            onClick={() => {
              setFilters((prv) => ({ ...prv, noSearch: false }));
              setReload((prv) => !prv);
            }}
            type="primary"
          >
            Filtrar
          </Button>
        </div>
      </section>
    </Container>
  );
});

export default Filters;
