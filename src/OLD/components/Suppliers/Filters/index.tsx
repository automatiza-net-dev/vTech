// @ts-nocheck
import React, { memo } from "react";

import { Input } from "antd";
import { InputBox } from "../styles";

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters({ filters, setFilters }) {
  return (
    <section className="uk-margin-top">
      <section style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "25%" }}>
          <label>Razão social / Nome Fantasia</label>
          <InputBox>
            <Input
              placeholder="Razão social / Nome fantasia"
              onChange={(e) =>
                setFilters({ ...filters, name: normalizeStr(e.target.value) })
              }
            />
          </InputBox>
        </div>
        <div style={{ width: "25%" }}>
          <label>Cnpj</label>
          <InputBox>
            <Input
              placeholder="CNPJ"
              onChange={(e) =>
                setFilters({ ...filters, document: e.target.value })
              }
            />
          </InputBox>
        </div>
      </section>
    </section>
  );
});

export default Filters;
