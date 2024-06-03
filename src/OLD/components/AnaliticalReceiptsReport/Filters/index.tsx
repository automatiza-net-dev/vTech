// @ts-nocheck
import { memo } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useSuppliers } from "@/OLD/hooks/useSuppliers";

import { Select, AutoComplete } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Container } from "./styles";
import { InputBox } from "./styles";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters({ filters, setFilters }) {
  const { businessUnits } = useBusinessUnitsByUser(false);
  const { suppliers } = useSuppliers();
  return (
    <Container className="uk-margin-top uk-flex">
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
        <label>Fornecedor</label>
        <AutoComplete
          className="uk-width-1-1"
          options={suppliers?.map((sup) => ({ ...sup, value: sup?.name }))}
          onChange={(e) =>
            setFilters((val) =>
              setFilters({ ...prv, supplierDescription: val })
            )
          }
          onSelect={(_, opt) =>
            setFilters((prv) => ({ ...prv, supplier_id: opt?.id }))
          }
          value={filters?.supplierDescription}
          filterOption={(val, opt) =>
            normalizeStr(opt?.value.toUpperCase()).includes(
              normalizeStr(val?.toUpperCase())
            )
          }
        />
      </InputBox>
      <InputBox className="uk-width-1-5">
        <label>Status</label>
        <Select className="uk-width-1-1"></Select>
      </InputBox>
    </Container>
  );
});

export default Filters;
