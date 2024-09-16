// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useProfile } from "@/OLD/hooks/useProfile";

import { InputBox } from "./styles";
import { Select, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "infinity-forge";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

function Filters({
  filters,
  setFilters,
  tutors,
  patients,
  search,
  loading,
}) {
  const [values, setValues] = useState({});

  const { businessUnits } = useBusinessUnitsByUser(false);
  const { clinic } = useProfile();

  sortItems(tutors, "name");
  sortItems(patients, "name");

  useEffect(() => {
    setFilters({ ...filters, economicGroups: [clinic?.economicGroup?.id] });
  }, [clinic]);

  return (
    <section className="uk-margin-small-top">
      <div className="uk-flex uk-flex-around" style={{ gap: "1rem" }}>
        <InputBox className="uk-width-1-3">
          <label>Unidade:&nbsp;</label>
          <Select
            allowClear
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, businessUnit: val });
            }}
            value={filters?.businessUnit}
          >
            {businessUnits.length > 0 &&
              businessUnits.map((unit) => (
                <Option value={unit?.id}>{unit?.fantasyName}</Option>
              ))}
          </Select>
        </InputBox>

        <InputBox className="uk-width-1-3">
          <label>Período:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) =>
              setFilters({
                ...filters,
                fromDate: val,
              })
            }
            value={filters?.fromIssue}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toDate: val })}
            value={filters?.toIssue}
            style={{ width: "100%" }}
          />
        </InputBox>

        <InputBox className="uk-width-1-5">
          <label>Status:&nbsp;</label>
          <Select
            allowClear
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, status: val === "TODOS" ? null : val });
            }}
            value={filters?.status ?? "TODOS"}
          >
            {["TODOS", "ABERTA", "BAIXADA", "EXTORNADA"].map((elem) => (
              <Option value={elem}>{elem}</Option>
            ))}
          </Select>
        </InputBox>
      </div>

      <div
        style={{ gap: "1rem", paddingTop: "1rem", alignItems: "center" }}
        className="uk-flex uk-flex-around"
      >
        <InputBox className="uk-width-1-4">
          <label>Cliente:&nbsp;</label>
          <AutoComplete
            options={tutors?.map((tutor) => ({
              ...tutor,
              key: tutor?.id,
              value: tutor?.name,
            }))}
            allowClear
            onClear={() => {
              const newObj = { ...filters };
              delete newObj?.client;
              setFilters(newObj);
            }}
            className="uk-width-1-1"
            onChange={(val) => {
              setValues({ ...values, clientName: val });
            }}
            onSelect={(_val, opt) => {
              setValues({ ...values, clientName: opt?.value });
              setFilters({ ...filters, client: opt?.id });
            }}
            value={values?.clientName}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value?.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>

        <InputBox className="uk-width-1-4">
          <label>Paciente:&nbsp;</label>
          <AutoComplete
            allowClear
            onClear={() => {
              const newObj = { ...filters };
              delete newObj?.patient;
              setFilters(newObj);
            }}
            value={values?.patientName}
            options={patients?.map((patient) => ({
              ...patient,
              key: patient?.id,
              value: patient?.name,
            }))}
            className="uk-width-1-1"
            onChange={(val) => {
              setValues({ ...values, patientName: val });
            }}
            onSelect={(val, opt) => {
              setValues({ ...values, patientName: opt?.value });
              setFilters({ ...filters, patient: opt?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value?.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>

        <Button
          onClick={search}
          type="primary"
          loading={loading}
          text="Filtrar"
        />
      </div>
    </section>
  );
};

export default Filters;
