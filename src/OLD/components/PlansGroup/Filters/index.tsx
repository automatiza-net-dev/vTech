// @ts-nocheck
import React, { memo } from "react";

import { InputBox } from "./styles";
import { Input } from "antd";

const Filters = memo(function ({ filters, setFilters }) {
  return (
    <section className="uk-width-1-1">
      <InputBox>
        <Input
          placeholder="Grupo de plano de contas"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
      </InputBox>
    </section>
  );
});

export default Filters;
