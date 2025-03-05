// @ts-nocheck
import { memo, useState } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";

import { InputBox } from "./styles";
import { Select, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "infinity-forge";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";
import { useSystem } from "@/presentation";

export function Filters({ filters, setFilters, values, setValues, setReload }) {
  const { businessUnits } = useBusinessUnitsByUser(false);
  const { patients } = usePatients();
  const { tutors } = useTutor(false, false);
  const { allEconomicGroup } = useEconomicGroup();

  sortItems(patients, "name");
  sortItems(tutors, "name");

  const {unit} = useSystem()

  return (
    <div className="uk-margin-small-top">
      <div className="uk-flex uk-flex-around">
        <InputBox className="uk-width-1-3">
          <label>Lançamento:&nbsp;</label>
          <DatePicker
            format="DD/MM/YYYY"
            slotProps={{ textField: { variant: "standard" } }}
            onChange={(val) =>
              setFilters({
                ...filters,
                fromBudgetDate: val,
              })
            }
            value={filters?.fromBudgetDate}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toBudgetDate: val })}
            value={filters?.toBudgetDate}
            style={{ width: "100%" }}
          />
        </InputBox>
        <InputBox className="uk-width-1-3">
          <label>Validade:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) =>
              setFilters({
                ...filters,
                fromExpirationtDate: val,
              })
            }
            value={filters?.fromExpirationDate}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) =>
              setFilters({ ...filters, toExpirationDate: val })
            }
            value={filters?.toExpirationDate}
            style={{ width: "100%" }}
          />
        </InputBox>
        <InputBox className="uk-width-1-3">
          <label>Confirmação / Cancelamento:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) =>
              setFilters({
                ...filters,
                fromFinishedDate: val,
              })
            }
            value={filters?.fromFinishedDate}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toFinishedDate: val })}
            value={filters?.toFinishedDate}
            style={{ width: "100%" }}
          />
        </InputBox>
      </div>
      <div className="uk-flex uk-flex-around uk-margin-small-top">
        <InputBox className="uk-width-1-4">
          <label>Status:</label>
          <Select
            onChange={(val) => setFilters({ ...filters, status: val })}
            vale={filters?.status}
            className="uk-width-1-1"
          >
            <Option value="todos">Todos</Option>
            <Option value="abertas">Abertos</Option>
            <Option value="cancelados">Cancelados</Option>
            <Option value="confirmados total">Confirmados (total)</Option>
            <Option value="confirmados parcial">Confirmados (parcial)</Option>
          </Select>
        </InputBox>
        <InputBox className="uk-width-1-3">
          <label>Cliente</label>
          <AutoComplete
            allowClear
            onClear={() => {
              const newObj = { ...filters };
              delete newObj?.client;
              setFilters(newObj);
            }}
            className="uk-width-1-1"
            value={values?.tutorName}
            options={tutors?.map((tutor) => ({
              ...tutor,
              value: tutor?.name,
            }))}
            onChange={(val) => {
              setValues({ ...values, tutorName: val });
              if (val === "") {
                const newObj = { ...filters };
                delete newObj.client;
                setFilters(newObj);
              }
            }}
            onSelect={(_, option) => {
              setValues({ ...values, tutorName: option?.value });
              setFilters({ ...filters, clientName: option?.value });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>
        {unit.system.type === "Vet" && (
          <InputBox className="uk-width-1-3">
            <label>Paciente</label>
            <AutoComplete
              allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.patientName;
                setFilters(newObj);
              }}
              className="uk-width-1-1"
              value={values?.patientName}
              options={patients?.map((patient) => ({
                ...patient,
                value: patient?.name,
              }))}
              onChange={(val) => {
                setValues({ ...values, patientName: val });
                if (val === "") {
                  const newObj = { ...filters };
                  delete newObj.patient;
                  setFilters(newObj);
                }
              }}
              onSelect={(_, option) => {
                setValues({ ...values, patientName: option?.value });
                setFilters({ ...filters, patientName: option?.value });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.name.toUpperCase()).includes(
                  normalizeStr(val.toUpperCase())
                )
              }
            />
          </InputBox>
        )}
      </div>
      <div className="uk-flex uk-flex-around uk-margin-small-top">
        <InputBox className="uk-width-1-1">
          <label>Unidade:&nbsp;</label>
          <Select
            mode="multiple"
            allowClear
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, businessUnit: val });
              setValues((prv) => ({
                ...prv,
                businessUnits: val,
              }));
            }}
            value={filters?.businessUnit}
          >
            {businessUnits.length > 0 &&
              businessUnits.map((unit) => (
                <Option value={unit?.id}>{unit?.fantasyName}</Option>
              ))}
          </Select>
        </InputBox>
        <Button
          type="primary"
          className="uk-margin-small-left"
          onClick={() => {
            setFilters({ ...filters, noSearch: false });
            setReload((prv) => !prv);
          }}
          text="Filtrar"
        />
      </div>
    </div>
  );
}

export default Filters;
