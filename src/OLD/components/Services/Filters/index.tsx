// @ts-nocheck
import React, { memo, useState } from "react";

// Hooks
import { useSubgroups } from "@/OLD/hooks/useSubgroup";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

import { Input, Select, AutoComplete } from "antd";
import { InputBox } from "./styles";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters({ filters, setFilters }) {
  const [subgroupSearch, setSubgroupSearch] = useState("");
  const [taxationgroupSearch, setTaxationgroupSearch] = useState("");
  const { subgroups } = useSubgroups();
  const { taxationGroups } = useTaxationGroups();

  return (
    <section className="uk-flex">
      <InputBox style={{ marginTop: "15px" }}>
        <Input
          placeholder="nome"
          onChange={(e) =>
            setFilters({
              ...filters,
              description: normalizeStr(e.target.value),
            })
          }
        />
      </InputBox>
      <div className="uk-width-1-5 uk-margin-small-right">
        <label>Subgrupo</label>
        <AutoComplete
          className="uk-width-1-1"
          allowClear
          onClear={() => {
            const newObj = { ...filters };
            delete newObj?.subgroup;
            setSubgroupSearch("");
            setFilters(newObj);
          }}
          options={subgroups.map((subgroup) => ({
            ...subgroup,
            value: subgroup?.description,
            key: subgroup?.id,
          }))}
          value={subgroupSearch}
          onChange={(val) => setSubgroupSearch(val)}
          onSelect={(_, option) =>
            setFilters({ ...filters, subgroup: option?.id })
          }
          filterOption={(value, option) =>
            normalizeStr(option?.description).includes(normalizeStr(value))
          }
        />
      </div>
      <div className="uk-width-1-5 uk-margin-small-right">
        <label>Grupo imposto</label>
        <AutoComplete
          allowClear
          onClear={() => {
            const newObj = { ...filters };
            delete newObj?.taxation;
            setTaxationgroupSearch("");
            setFilters(newObj);
          }}
          className="uk-width-1-1"
          options={taxationGroups.map((group) => ({
            ...group,
            value: group?.name,
          }))}
          value={taxationgroupSearch}
          onChange={(val) => setTaxationgroupSearch(val)}
          onSelect={(_, option) =>
            setFilters({ ...filters, taxation: option?.id })
          }
          filterOption={(value, option) =>
            normalizeStr(option?.name).includes(normalizeStr(value))
          }
        />
      </div>
      <div className="uk-width-1-5 uk-margin-small-right">
        <label>Status</label>
        <Select
          onChange={(val) => {
            if (val === "all") {
              const newObj = { ...filters };
              delete newObj?.active;
              return setFilters(newObj);
            }
            setFilters({ ...filters, active: val });
          }}
          className="uk-width-1-1"
        >
          <Option value={true}>Ativo</Option>
          <Option value={false}>Inativo</Option>
          <Option value="all">Todos</Option>
        </Select>
      </div>
    </section>
  );
});

export default Filters;
