// @ts-nocheck
import { memo } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import { InputBox } from "./styles";
import { DateFilter } from "@/OLD/components/mini-components";
import { Select, DatePicker, Button } from "antd";
const { Option } = Select;

function Filters({
  filters,
  setFilters,
  setReload,
  setValues,
}) {
  const { businessUnits } = useBusinessUnitsByUser(false);

  return (
    <section className="uk-margin-small-top">
      <div className="uk-flex uk-flex-around">
        <InputBox className="uk-width-1-3 uk-margin-top">
          <label>Unidade:&nbsp;</label>
          <Select
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters({ ...filters, businessUnit: val });
              setValues((prv) => ({
                ...prv,
                clinicFantasyName: businessUnits.find(
                  (unit) => unit?.id === val
                )?.fantasyName,
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
        <div className="uk-width-1-3">
          <DateFilter
            state={filters}
            setState={setFilters}
            from={"fromDate"}
            to={"toDate"}
          />
          <InputBox className="uk-width-1-1">
            <label>Período:&nbsp;</label>
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(val) => setFilters({ ...filters, fromDate: val })}
              value={filters?.fromDate}
            />
            &nbsp;à&nbsp;
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(val) => setFilters({ ...filters, toDate: val })}
              value={filters?.toDate}
            />
          </InputBox>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setFilters({ ...filters, noSearch: false });
              setReload((prv) => !prv);
            }}
          >
            Filtrar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Filters;
