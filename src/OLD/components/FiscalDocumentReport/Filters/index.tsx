import { DatePicker } from "@mui/x-date-pickers";
import { Select } from "antd";
import { InputBox } from "./styles";

export function Filters({ filters, setFilters }) {
  return (
    <div className="uk-margin-small-top">
      <div className="uk-flex uk-flex-around">
        <InputBox className="uk-width-1-3">
          <label htmlFor="fromTo">Lançamento:&nbsp;</label>
          <DatePicker
            format="DD/MM/YYYY"
            slotProps={{ textField: { variant: "standard" } }}
            onChange={(val) =>
              setFilters({
                ...filters,
                fromDate: val,
              })
            }
            value={filters?.fromBudgetDate}
          />
          &nbsp;à&nbsp;
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            format="DD/MM/YYYY"
            onChange={(val) => setFilters({ ...filters, toDate: val })}
            value={filters?.toBudgetDate}
          />
        </InputBox>
        <InputBox className="uk-width-1-4">
          <label htmlFor="status">Status:</label>
          <Select
            onChange={(val) => setFilters({ ...filters, status: val })}
            value={filters?.status}
            defaultValue={"todas"}
            className="uk-width-1-1"
            options={[
              { label: "Todas", value: "todas" },
              { label: "Transmitidas", value: "transmitidas" },
              { label: "Com erro", value: "erros" },
            ]}
          />
        </InputBox>
      </div>
    </div>
  );
}

export default Filters;
