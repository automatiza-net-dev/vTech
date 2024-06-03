// @ts-nocheck
import React, { memo } from "react";

import { Input } from "antd";
import { InputBox } from "../styles";

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters({ filters, setFilters }) {
  return (
    <section className="uk-margin-top">
      <section className="uk-flex">
        <InputBox className="uk-width-1-4 uk-margin-right">
          <Input
            placeholder="Razão social / Nome fantasia"
            onChange={(e) =>
              setFilters({ ...filters, name: normalizeStr(e.target.value) })
            }
          />
        </InputBox>
        <InputBox className="uk-width-1-4">
          <Input
            placeholder="CNPJ"
            onChange={(e) =>
              setFilters({ ...filters, document: e.target.value })
            }
          />
        </InputBox>
      </section>
    </section>
  );
});

export default Filters;
