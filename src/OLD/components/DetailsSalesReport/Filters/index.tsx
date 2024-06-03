// @ts-nocheck
import * as React from "react";

import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import { DatePicker } from "@mui/x-date-pickers";
import { Select } from "antd";
const { Option } = Select;
import { InputBox } from "./styles";

import { places } from "@/OLD/utils/places";

const Filters = React.memo(function Filters({ filters, setFilters }) {
  const [cities, setCities] = React.useState([]);

  const { businessUnits } = useBusinessUnitsByUser(false);
  const { allEconomicGroup } = useEconomicGroup();

  return (
    <section>
      <div className="uk-flex uk-flex-around uk-margin-small-top">
        <InputBox className="uk-width-1-3">
          <label>Período:&nbsp;</label>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, fromDate: val })}
            value={filters?.fromDate}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toDate: val })}
            value={filters?.toDate}
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
      </div>
      {/*
      <div className="uk-flex uk-flex-around uk-margin-small-top">
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
      <hr />
    </section>
  );
});

export default Filters;
