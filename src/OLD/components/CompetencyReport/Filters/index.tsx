// @ts-nocheck
import { memo } from "react";

import { useUserBusinessUnits } from "@/OLD/hooks/useUserBusinessUnits";

import { DatePicker } from "@mui/x-date-pickers";
import { InputBox } from "../styles";
import { Select } from "antd";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { DateFilter } from "@/OLD/components/mini-components";
const { Option } = Select;

import { MdOutlineClear } from "react-icons/md";

import { sortItems } from "@/OLD/utils/sortItems";

const Filters = memo(function Filters({ filters, setFilters, setReload }) {
  const { units } = useUserBusinessUnits();

  sortItems(units, "identification");

  return (
    <section className="uk-flex uk-margin-small-top" style={{ gap: "5px" }}>
      <div>
        <div className="uk-flex">
          <label>Período</label>
          {/*
          <DateFilter
            state={filters}
            setState={setFilters}
            from={"fromDate"}
            to={"toDate"}
          />
          */}
        </div>
        <InputBox>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            type="date"
            value={filters?.fromDate}
            format="MM/YYYY"
            onChange={(val) =>
              setFilters((prv) => ({ ...prv, fromDate: val, toDate: val }))
            }
          />
          {/*
          &nbsp;&nbsp;à&nbsp;&nbsp;

          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            type="date"
            value={filters?.toDate}
            onChange={(val) => setFilters((prv) => ({ ...prv, toDate: val }))}
          />
          */}
          <MdOutlineClear
            size={40}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setFilters((prv) => ({ prv, fromDate: null, toDate: null }))
            }
          />
        </InputBox>
      </div>
      <div className="uk-width-1-4">
        <label>Unidade</label>
        <InputBox>
          <Select
            mode="multiple"
            value={filters?.businessUnits}
            className="uk-width-1-1"
            onChange={(val) => setFilters({ ...filters, businessUnits: val })}
          >
            {units?.map((unit) => (
              <Option value={unit?.id}>{unit?.identification}</Option>
            ))}
          </Select>
        </InputBox>
      </div>
      <div className="uk-margin-top">
        <CustomButton
          onClick={() => {
            setFilters((prv) => ({ ...filters, noSearch: false }));
            setReload((prv) => !prv);
          }}
        >
          Filtrar
        </CustomButton>
      </div>
    </section>
  );
});

export default Filters;
