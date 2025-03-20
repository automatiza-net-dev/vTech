// @ts-nocheck
import React, { memo, useState } from "react";

import { useTutor } from "@/OLD/hooks/useTutor";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useAuth } from "@/OLD/hooks/useAuth";

import { InputBox } from "./styles";
import { AutoComplete, Input } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters({ filters, setFilters }) {
  const [values, setValues] = useState({});

  const { tutors } = useTutor();
  const { patients } = usePatients();
  

  

  return (
    <section className="uk-flex uk-flex-around uk-margin-top">
      <InputBox className="uk-width-1-3">
        <label>Criação:</label>
        &nbsp;
        <DatePicker
          slotProps={{ textField: { variant: "standard" } }}
          className="uk-margin-right"
          onChange={(val) => setFilters({ ...filters, from: val })}
          format="DD/MM/YYYY"
        />
        à
        <DatePicker
          slotProps={{ textField: { variant: "standard" } }}
          className="uk-margin-left"
          onChange={(val) => setFilters({ ...filters, to: val })}
          format="DD/MM/YYYY"
        />
      </InputBox>
      <InputBox className="uk-width-1-5">
        <label>Cliente:</label>
        &nbsp;
        <AutoComplete
          className="uk-width-1-1"
          value={values?.clientName}
          options={tutors.map((tutor) => ({
            ...tutor,
            value: tutor?.name,
            key: tutor?.id,
          }))}
          onChange={(val) => {
            setValues({ ...values, clientName: val });
            if (val === "") {
              const newObj = { ...filters };
              delete newObj?.patient;
              setFilters(newObj);
            }
          }}
          onSelect={(_, opt) => {
            setFilters({ ...filters, patient: opt?.id });
            setValues({ ...values, clientName: opt?.name });
          }}
          filterOption={(val, opt) =>
            normalizeStr(opt?.value.toUpperCase()).includes(
              normalizeStr(val.toUpperCase())
            )
          }
        />
      </InputBox>
      {type === "Vet" && (
        <InputBox className="uk-width-1-5">
          <label>Paciente:</label>
          &nbsp;
          <AutoComplete
            className="uk-width-1-1"
            value={values?.patientName}
            options={patients?.map((patient) => ({
              ...patient,
              value: patient?.name,
              key: patient?.id,
            }))}
            onChange={(val) => setValues({ ...values, patientName: val })}
            onSelect={(val, opt) => {
              setValues({ ...values, patientName: opt?.name });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>
      )}
      <InputBox className="uk-width-1-5">
        <label>Código:</label>
        &nbsp;
        <Input />
      </InputBox>
    </section>
  );
});

export default Filters;
