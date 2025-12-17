// @ts-nocheck
import { Dispatch, memo, SetStateAction, useState } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useTutor } from "@/OLD/hooks/useTutor";

import { InputBox } from "./styles";
import { Select, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

export const Filters = memo(function Filters({
  filters,
  setFilters,
}: {
  filters: Record<string, unknown>;
  setFilters: Dispatch<SetStateAction<any>>;
}) {
  const [values, setValues] = useState({});

  const { businessUnits } = useBusinessUnitsByUser(false);
  const { tutors } = useTutor(false, false);

  const patients = filters.client
    ? (tutors.find((t) => t.id === filters.client)?.patients ?? [])
    : [];

  sortItems(tutors, "name");
  sortItems(patients, "name");

  return (
    <div className="uk-margin-small-top">
      <div className="uk-flex uk-flex-center uk-flex-around">
        <InputBox className="uk-width-1-3">
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
        <InputBox className="uk-width-1-3">
          <label>Período:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            type="date"
            onChange={(val) => {
              setFilters({
                ...filters,
                fromDate: val,
              });
            }}
            value={filters?.fromDate}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            type="date"
            onChange={(val) => setFilters({ ...filters, toDate: val })}
            value={filters?.toDate}
            style={{ width: "100%" }}
          />
        </InputBox>
        <InputBox className="uk-width-1-4">
          <label>Status:</label>
          <Select
            onChange={(val) => {
              if (val === "all") {
                const newObj = { ...filters };
                delete newObj?.status;
                return setFilters(newObj);
              }
              setFilters({ ...filters, status: val });
            }}
            vale={filters?.status}
            className="uk-width-1-1"
          >
            <Option value="all">Todos</Option>
            <Option value="ABERTA">Abertas</Option>
            <Option value="BAIXADA">Baixadas</Option>
          </Select>
        </InputBox>
      </div>
      <div className="uk-flex uk-flex-around uk-margin-small-top">
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
              setFilters({ ...filters, client: option?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name.toUpperCase()).includes(
                normalizeStr(val.toUpperCase()),
              )
            }
          />
        </InputBox>
        <InputBox className="uk-width-1-3">
          <label>Paciente</label>
          <AutoComplete
            allowClear
            disabled={!filters.client || patients?.length === 0}
            onClear={() => {
              const newObj = { ...filters };
              delete newObj?.patient;
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
              setFilters({ ...filters, patient: option?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name.toUpperCase()).includes(
                normalizeStr(val.toUpperCase()),
              )
            }
          />
        </InputBox>
      </div>
    </div>
  );
});

export default Filters;
