// @ts-nocheck
import { memo } from "react";

import { useUserBusinessUnits } from "@/OLD/hooks/useUserBusinessUnits";

import { DatePicker } from "@mui/x-date-pickers";
import { InputBox } from "../styles";
import { Select } from "antd";
import { Button, FormHandler, InputDateRange } from "infinity-forge";
import { DateFilter } from "@/OLD/components/mini-components";
const { Option } = Select;

import { MdOutlineClear } from "react-icons/md";

import { sortItems } from "@/OLD/utils/sortItems";

const Filters = memo(function Filters({ filters, setFilters, setReload }) {
  const { units } = useUserBusinessUnits();

  sortItems(units, "identification");

  return (
    <section className="uk-flex uk-margin-small-top" style={{ gap: "5px" }}>
      <FormHandler
        cleanFieldsOnSubmit={false}
        onChangeForm={{
          callbackResult: (formValues) => {
            setFilters(formValues);
          },
        }}
      >
        <InputDateRange
          enableFilter
          id="Date"
          placeholder="DD/MM/YYYY"
          label="Período"
          names={["fromDate", "toDate"]}
          isClearable
        />
      </FormHandler>

      <div className="uk-width-1-4">
        <label>Unidade</label>
        <InputBox>
          <Select
            mode="multiple"
            value={filters?.businessUnits}
            className="uk-width-1-1"
          >
            {units?.map((unit) => (
              <Option value={unit?.id}>{unit?.identification}</Option>
            ))}
          </Select>
        </InputBox>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "60%" }}
      >
        <Button
          onClick={() => {
            setFilters((prv) => ({ ...filters, noSearch: false }));
            setReload((prv) => !prv);
          }}
          text="Filtrar"
        />
      </div>
    </section>
  );
});

export default Filters;
