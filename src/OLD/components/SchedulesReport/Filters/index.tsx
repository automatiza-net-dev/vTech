// @ts-nocheck
import { memo, useEffect, useState } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { usePatients } from "@/OLD/hooks/usePatients";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useScheduleStatus } from "@/OLD/hooks/useScheduleStatus";
import { useAuth } from "@/OLD/hooks/useAuth";

import { InputBox } from "./styles";
import { Select, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "infinity-forge";

import { places } from "@/OLD/utils/places";
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";
import { useConfigurationsSystem } from "@/presentation";

export function Filters({ filters, setFilters, values, setValues, setReload }) {
  const [cities, setCities] = useState([]);

  const { businessUnits } = useBusinessUnitsByUser(false);
  const { patients } = usePatients();
  const { tutors } = useTutor(false, false);
  const { scheduleStatus } = useScheduleStatus();

  const { type} =useConfigurationsSystem()

  // const { allEconomicGroup } = useEconomicGroup();

  sortItems(patients, "name");
  sortItems(tutors, "name");

  useEffect(() => {
    const newArr = [];
    places?.map(
      (item) =>
        filters?.businessStates?.includes(item?.value) &&
        newArr.push(...item?.cities)
    );
    setCities(newArr);
  }, [filters?.businessStates]);

  return (
    <div className="uk-margin-small-top">
      <div className="uk-flex" style={{ gap: "10px" }}>
        <InputBox className="uk-width-1-3">
          <label>Data:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) =>
              setFilters({
                ...filters,
                fromDate: val,
              })
            }
            value={filters?.fromDate}
            style={{ width: "100%" }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toDate: val })}
            value={filters?.toDate}
            style={{ width: "100%" }}
          />
        </InputBox>
        <InputBox className="uk-width-1-4">
          <label>Status:</label>
          <Select
            onChange={(val) => setFilters({ ...filters, status: val })}
            vale={filters?.status}
            className="uk-width-1-1"
            allowClear
          >
            {scheduleStatus?.length > 0 &&
              scheduleStatus?.map((item) => (
                <Option value={item?.id}>{item?.description}</Option>
              ))}
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
              setFilters({ ...filters, client: option?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.name.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>
      </div>
      <div className="uk-margin-small-top uk-flex" style={{ gap: "10px" }}>
        {/*
        <InputBox className="uk-width-1-3">
          <label>Grupo economico</label>
          <Select
            mode="multiple"
            allowClear
            className="uk-width-1-1"
            onChange={(val) => setFilters({ ...filters, economicGroups: val })}
            value={filters?.economicGroups}
          >
            {allEconomicGroup?.length > 0 &&
              allEconomicGroup?.map((eg) => (
                <Option value={eg?.id}>{eg?.fantasy_name}</Option>
              ))}
          </Select>
        </InputBox>
        */}
        <InputBox className="uk-width-1-3">
          <label>Unidade:&nbsp;</label>
          <Select
            mode="multiple"
            allowClear
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, businessUnits: val });
              setValues((prv) => ({
                ...prv,
                businessUnits: val,
              }));
            }}
            value={filters?.businessUnits}
          >
            {businessUnits.length > 0 &&
              businessUnits.map((unit) => (
                <Option value={unit?.id}>{unit?.fantasyName}</Option>
              ))}
          </Select>
        </InputBox>

        {type === "Vet" && (
          <InputBox className="uk-width-1-3">
            <label>Paciente</label>
            <AutoComplete
              allowClear
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
                if (val === "") {
                  const newObj = { ...filters };
                  delete newObj.patient;
                  setFilters(newObj);
                }
                setValues({ ...values, patientName: val });
              }}
              onSelect={(_, option) => {
                setValues({ ...values, patientName: option?.value });
                setFilters({ ...filters, patient: option?.id });
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
      {/*
      <div className="uk-flex uk-flex-around uk-margin-small-top">
        <InputBox className="uk-width-1-4">
          <label>UF: </label>
          <Select
          value={filters?.businessStates}
            mode="multiple"
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, businessStates: val });
              setCities(
                places?.filter((item) =>
                  filters?.businessStates.includes(item?.value)
                )?.cities
              );
            }}
          >
            {places?.map((place, i) => (
              <Option key={i} value={place?.value}>
                {place?.value}
              </Option>
            ))}
          </Select>
        </InputBox>
        <InputBox className="uk-width-1-3">
          <label>Município:</label>
          <Select
            className="uk-width-1-1"
            value={filters?.businessCities}
            mode="multiple"
            onChange={(val) => {
              setFilters({ ...filters, businessCities: val });
            }}
          >
            {cities?.map((city) => (
              <Option value={city?.value}>{city?.value}</Option>
            ))}
          </Select>
        </InputBox>
      </div>
            */}
      <div className="uk-flex uk-flex-right">
        <Button
          onClick={() => {
            setFilters((prv) => ({ ...prv, noSearch: false }));
            setReload((prv) => !prv);
          }}
          text="Filtrar"
        />
      </div>
    </div>
  );
}

export default Filters;
