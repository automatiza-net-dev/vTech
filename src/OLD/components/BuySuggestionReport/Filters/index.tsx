// @ts-nocheck
import { memo } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import { InputBox } from "./styles";
import { Select } from "antd";
const { Option } = Select;

const Filters = memo(function Filters({ filters, setFilters }) {
  const { businessUnits } = useBusinessUnitsByUser(false);
  return (
    <section className="uk-margin-top">
      <InputBox className="uk-width-1-3">
        <label>Unidade:&nbsp;</label>
        <Select
          mode="multiple"
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
    </section>
  );
});

export default Filters;
